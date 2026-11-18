// Eleventy settings. Words live in content/, the look lives in design/.
import { HtmlBasePlugin } from "@11ty/eleventy";
import { inline, imagePath } from "./lib/markdown.js";

export default function (eleventyConfig) {
  // The stylesheet, script and images come straight from the design folder
  eleventyConfig.addPassthroughCopy({
    "design/styles.css": "styles.css",
    "design/filters.js": "filters.js",
    "design/menu.js": "menu.js",
    "design/images": "images",
    // Browser tab and bookmark icons, served from the site root
    "design/icons": "/",
  });

  // Rebuild the preview when content or the design changes
  eleventyConfig.addWatchTarget("content/");
  eleventyConfig.addWatchTarget("design/");
  eleventyConfig.addWatchTarget("lib/");

  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true, throwOnUndefined: false });
  eleventyConfig.addFilter("inline", (text) => inline(text));
  eleventyConfig.addFilter("img", (src) => imagePath(src));

  // Lets the site live in a sub-folder (e.g. GitHub Pages) via PATH_PREFIX
  eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    dir: { input: "templates", includes: "_includes", data: "_data", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
