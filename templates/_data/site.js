// Reads every file in content/ so the templates can use it as `site.*`.
// You shouldn't need to edit this file to change any words on the site.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { md, caseStudySections } from "../../lib/markdown.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const contentDir = path.join(root, "content");

function read(file) {
  const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
  // Pass an empty options object so gray-matter doesn't cache stale results while previewing
  const { data, content } = matter(raw, {});
  return { ...data, body: content.trim() };
}

function loadCaseStudies() {
  const dir = path.join(contentDir, "case-studies");
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^\d+.*\.md$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b));

  const list = files.map((file) => {
    const data = read(path.join("case-studies", file));
    const slug = data.slug || file.replace(/^\d+[-_ ]*/, "").replace(/\.md$/, "");
    return { ...data, slug, file, sections: caseStudySections(data.body) };
  });

  // "Next case study" goes to the next file, wrapping from the last back to the first
  list.forEach((cs, i) => {
    const next = list[(i + 1) % list.length];
    cs.next = { slug: next.slug, title: next.title };
  });
  return list;
}

export default function () {
  const home = read("home.md");
  return {
    home: { ...home, about_html: md.render(home.body) },
    highlights: read("highlights.md").highlights || [],
    testimonials: read("testimonials.md").testimonials || [],
    about: read("about.md"),
    notFound: (() => {
      const p = read("404.md");
      return { ...p, html: md.render(p.body) };
    })(),
    caseStudies: loadCaseStudies(),
  };
}
