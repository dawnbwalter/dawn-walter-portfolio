# Dawn Walter — portfolio site: build brief for Claude Code

This folder holds the finished design for Dawn Walter's content design portfolio, and all of its words. Please turn it into a small static website that Dawn can keep editing herself.

## The most important requirement

**Dawn must be able to change any text on the site by editing Markdown files only.** She is comfortable with Markdown but doesn't want to touch HTML, CSS or JavaScript to change wording, reorder testimonials, add a highlight or add a new case study.

- All words live in `content/`. Nothing in the templates should hold copy; if you find text in `design/` that isn't in `content/`, move it into `content/`.
- Keep the content files as they are structured now (front matter plus Markdown body). Light changes are fine if a generator needs them, but keep them readable for a non-developer, and keep the comments in them.
- Adding a new case study should mean: copy a file in `content/case-studies/`, rename it with the next number, edit the text, drop images in the images folder (currently `design/images/`; image paths in `content/` are relative to it). The homepage card, the page and the "Next case study" links should all update on their own.
- Add a short `EDITING.md` for Dawn, in plain English: where each piece of text lives, how to add a case study, testimonial or highlight, how to preview locally, and how to publish.

## Keep it simple to set up and host

- Use a lightweight static site generator. **Eleventy (11ty)** is a good fit: plain HTML templates, reads Markdown and front matter directly, and needs no framework. Astro is also fine. Avoid anything that needs a server, database or CMS.
- Host on a free static host that deploys from GitHub, such as **Netlify, Cloudflare Pages or GitHub Pages**. Set it up so that pushing a change to the main branch publishes the site.
- No build tooling beyond what the generator needs. No CSS framework: `design/styles.css` is the stylesheet.

## Hosting and domain decisions

- **Domain:** dawnbwalter.com, already registered at Namecheap with domain privacy on. Don't buy anything else from Namecheap. SSL comes free from the host.
- **Host:** Cloudflare Pages on the free plan, publishing automatically from a GitHub repository whenever the main branch changes.
- **Connecting the domain:** add the domain to a free Cloudflare account and switch its nameservers at Namecheap to the ones Cloudflare gives. Then attach dawnbwalter.com and www.dawnbwalter.com to the Pages project, with www redirecting to dawnbwalter.com. Explain it step by step (Dawn hasn't done this before), including any waiting time for DNS changes.
- **Accounts:** Dawn creates the GitHub and Cloudflare accounts and enters any passwords herself.

## What's in this folder

```
design/              The finished design as plain HTML. Open index.html in a browser.
  index.html         Homepage
  self-employed-payments.html
  pricing-test.html
  content-audit.html  The three case study pages
  styles.css         All styles (design tokens at the top)
  filters.js         Testimonial filter buttons (All / Managers / Cross-functional partners / Peers)
  images/            Every image used on the site

content/             Every word on the site, as Markdown
  home.md            Name, hero, focus areas, section headings, About intro, links
  highlights.md      The six highlights
  testimonials.md    The six testimonials, in display order, with group and photo
  about.md           Skills, tools, experience, education, professional development, languages
  case-studies/      One file per case study, numbered for order
```

**The HTML in `design/` is the source of truth for how the site looks.** Match it closely, including at phone widths (layouts already wrap). Templates should reproduce this markup and class names, filled from `content/`.

## Notes on specific parts

- **Case study pages.** Front matter supplies the logo, title, hero image and caption, and the "Project" row. Each `##` heading in the body becomes a labelled row (label on the left, content on the right), in the order written. Numbered lists in "What I did" render as the 01 / 02 / 03 steps (`ol.steps`). Bullet lists render as `ul.bullets`. A blockquote (`>`) renders as the larger pull line (`p.pull`). An image with a title renders as `figure.inline-figure` with the title as its caption.
- **"Next case study"** links to the next file in number order and wraps from the last back to the first. It shows that case study's `title`.
- **Homepage cards** use the `card_*` fields. `card_image_small: true` uses the narrower image (`img.small`).
- **Testimonials.** The site adds the curly quotation marks around each quote. `group` controls the filters: `manager`, `xfn` or `peer`.
- **Tags** (2:1, First Class, Upcoming) come from `tag:` in `about.md`. Removing the line removes the tag.
- **Flags** in Languages are small inline SVGs (see `design/index.html`). Turn them into a reusable include picked by the codes in `about.md` (`uk`, `de`, `es`, `it`).
- **Low-detail images.** The Pricing Test dry-test image and the Content Audit journey map are deliberately small and low resolution so the work can't be read in detail. Don't replace them with larger versions or add zoom.
- **Accessibility.** Keep the existing alt text, heading order, visible focus states, 44px touch targets and colour contrast. The accent colour is Denim `#2D5B88`, which passes WCAG AA for small text on the page background.
- **Fonts.** Schibsted Grotesk for headings and Inter for body text, both from Google Fonts.

## Also worth doing

- Page titles and meta descriptions from front matter, plus a simple social share image.
- A 404 page in the same style.
- Check the finished site in a browser at desktop and phone widths against `design/`.
