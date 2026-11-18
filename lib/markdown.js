// Turns the Markdown in content/ into HTML that matches the design's class names.
import MarkdownIt from "markdown-it";

// Plain Markdown: used for paragraphs and inline text (links, bold, etc.)
export const md = new MarkdownIt({ html: true });

// Inline Markdown, for one-line fields such as "testimonials_more"
export function inline(text) {
  return text == null ? "" : md.renderInline(String(text));
}

// Case study bodies use a few extra rules:
//   1. 2. 3.      -> ol.steps with 01 / 02 / 03 numbers
//   - bullets     -> ul.bullets
//   > quote       -> p.pull (the larger pull line)
//   ![alt](src "caption") on its own line -> figure.inline-figure with a caption
//   <!-- comments --> are left out of the page
const cs = new MarkdownIt({ html: true });

cs.core.ruler.push("case_study_classes", (state) => {
  const listStack = [];
  let quoteDepth = 0;
  const tokens = state.tokens;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    switch (t.type) {
      case "ordered_list_open":
        t.attrJoin("class", "steps");
        listStack.push({ ordered: true, n: Number(t.attrGet("start") || 1) - 1 });
        t.attrs = t.attrs.filter(([k]) => k !== "start");
        break;
      case "bullet_list_open":
        t.attrJoin("class", "bullets");
        listStack.push({ ordered: false });
        break;
      case "ordered_list_close":
      case "bullet_list_close":
        listStack.pop();
        break;
      case "list_item_open": {
        const list = listStack[listStack.length - 1];
        if (list && list.ordered) {
          list.n += 1;
          t.meta = { step: String(list.n).padStart(2, "0") };
          // Mark the matching close token
          let depth = 0;
          for (let j = i + 1; j < tokens.length; j++) {
            if (tokens[j].type === "list_item_open") depth++;
            if (tokens[j].type === "list_item_close") {
              if (depth === 0) { tokens[j].meta = { step: true }; break; }
              depth--;
            }
          }
        }
        break;
      }
      case "blockquote_open":
        quoteDepth++;
        break;
      case "blockquote_close":
        quoteDepth--;
        break;
      case "paragraph_open": {
        const inlineTok = tokens[i + 1];
        const kids = (inlineTok && inlineTok.children || []).filter(
          (c) => !(c.type === "text" && c.content.trim() === "") && c.type !== "softbreak"
        );
        if (kids.length === 1 && kids[0].type === "image" && kids[0].attrGet("title")) {
          t.meta = { figure: true };
          tokens[i + 2].meta = { figure: true };
          kids[0].meta = { figure: true };
        } else if (quoteDepth > 0) {
          t.attrJoin("class", "pull");
        }
        break;
      }
    }
  }
});

const r = cs.renderer.rules;
const defaultRender = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);

r.list_item_open = (tokens, idx, options, env, self) => {
  const t = tokens[idx];
  if (t.meta && t.meta.step) {
    return `<li><span class="n" aria-hidden="true">${t.meta.step}</span><span>`;
  }
  return defaultRender(tokens, idx, options, env, self);
};
r.list_item_close = (tokens, idx, options, env, self) =>
  tokens[idx].meta && tokens[idx].meta.step ? "</span></li>\n" : defaultRender(tokens, idx, options, env, self);

r.blockquote_open = () => "";
r.blockquote_close = () => "";

r.paragraph_open = (tokens, idx, options, env, self) =>
  tokens[idx].meta && tokens[idx].meta.figure ? '<figure class="inline-figure">\n' : defaultRender(tokens, idx, options, env, self);
r.paragraph_close = (tokens, idx, options, env, self) =>
  tokens[idx].meta && tokens[idx].meta.figure ? "</figure>\n" : defaultRender(tokens, idx, options, env, self);

// Image paths in content/ are relative to the images folder's parent ("images/…").
// Make them start at the site root so they work on every page.
export function imagePath(src) {
  if (!src || /^([a-z]+:|\/|#)/i.test(src)) return src;
  return "/" + src.replace(/^\.\//, "");
}

const defaultImage = cs.renderer.rules.image;
r.image = (tokens, idx, options, env, self) => {
  const t = tokens[idx];
  t.attrSet("src", imagePath(t.attrGet("src")));
  if (t.meta && t.meta.figure) {
    const src = cs.utils.escapeHtml(t.attrGet("src"));
    const alt = cs.utils.escapeHtml(self.renderInlineAsText(t.children, options, env));
    const caption = cs.utils.escapeHtml(t.attrGet("title"));
    return `<img src="${src}" alt="${alt}">\n<figcaption>${caption}</figcaption>`;
  }
  return defaultImage(tokens, idx, options, env, self);
};

// Drop HTML comments (notes to self) from the published page
r.html_block = (tokens, idx) => (/^\s*<!--[\s\S]*-->\s*$/.test(tokens[idx].content) ? "" : tokens[idx].content);

// Split a case study body into labelled rows, one per "## Heading"
export function caseStudySections(body) {
  const sections = [];
  let current = null;
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^##\s+(.+?)\s*#*\s*$/);
    if (m) {
      current = { label: m[1], text: "" };
      sections.push(current);
    } else if (current) {
      current.text += line + "\n";
    }
  }
  return sections.map((s) => ({ label: s.label, html: cs.render(s.text).trim() }));
}
