# Editing your portfolio

Every word on the site lives in the `content/` folder, written in Markdown. You never need to open the HTML, CSS or JavaScript files to change the text.

Each content file starts with a block between two `---` lines (called "front matter"). In that block:

- Each line is a `name: value` pair. Change the words after the colon and leave the name alone.
- Lines starting with `#` are notes to you. They don't appear on the site.
- A line starting with `-` is one item in a list. Indent it the same way as the items around it (use spaces, not tabs).
- If a value contains a colon (`:`) or starts with a quote mark, put the whole value in double quotes, like `page_title: "Case study: My project"`.

You can use Markdown inside most values, for example `[link text](https://example.com)` for a link or `**bold**`.

## Where each piece of text lives

| On the site | File |
| --- | --- |
| Your name, the big headline, intro, focus-area pills, section headings, the About paragraph and photo, the footer | `content/home.md` |
| Menu links, button text and small labels (Skills, Tools, "Read case study →", "Next case study"…) | `content/home.md`, under `labels:` |
| Browser tab title, search-engine description and link-preview image for the homepage | `content/home.md` (`page_title`, `description`, `share_image`) |
| The six highlights | `content/highlights.md` |
| Testimonials and the filter groups | `content/testimonials.md` |
| Skills, tools, experience, education, professional development, languages | `content/about.md` |
| Each case study (its homepage card and its page) | `content/case-studies/` |
| The "page not found" page | `content/404.md` |

Images go in `design/images/`. In content files, write image paths as `images/file-name.jpg`.

## Adding a case study

1. In `content/case-studies/`, copy an existing file (e.g. `03-content-audit.md`).
2. Rename the copy with the next number, e.g. `04-my-new-project.md`. The number sets the order on the homepage.
3. Change `slug:` to a short, unique web address with no spaces, e.g. `my-new-project`. The page will be at `/my-new-project/`.
4. Edit the rest of the front matter:
   - `title`: the heading on the page (also used in the "Next case study" link).
   - `page_title`, `description`: browser tab title and link-preview text.
   - `card_title`, `card_product`, `card_outcome`, `card_image`: the homepage card. Add `card_image_small: true` for the narrower card image.
   - `logo`, `logo_alt`, `hero_image`, `hero_alt`, `hero_caption`, `project`: the top of the page. Add `hero_low_detail: true` to show the hero image small.
5. Write the body below the second `---`. Each `## Heading` becomes a row, with the heading as its label on the left.
   - A numbered list (`1.`, `2.`, `3.`) shows as the big 01 / 02 / 03 steps.
   - A bullet list (`-`) shows as bullets.
   - A line starting with `>` shows as the larger pull line.
   - An image with a caption: `![Alt text describing the image](images/my-image.jpg "The caption under it")`
6. Put the images in `design/images/`.

The homepage card, the new page and all the "Next case study" links update by themselves. To remove a case study, delete its file. To reorder, change the numbers.

## Adding or changing a testimonial

In `content/testimonials.md`, copy one whole entry (from `- name:` down to its `quote:` line) and edit it. Testimonials appear in the order listed.

- `group` must be `manager`, `xfn` (cross-functional partner) or `peer`. This decides which filter button shows it.
- `photo`: a small square photo in `design/images/`.
- Write the `quote` without quotation marks. The site adds the curly quotes.

## Adding a highlight

In `content/highlights.md`, copy a `- figure:` entry along with the `text:` line under it. `figure` is the big blue text and `text` is the sentence underneath.

## Education and professional development tags

Add `tag: Something` to an entry in `content/about.md` to show a small blue tag next to it, such as "Upcoming". Delete the line to remove the tag. If the tag starts with a number or contains a colon, wrap it in quotes, e.g. `tag: "2:1"`.

## Languages and flags

In `content/about.md`, `flags:` takes one or more of `uk`, `de`, `es`, `it`, e.g. `flags: [es, it]`.

## Previewing on your computer

You need [Node.js](https://nodejs.org) (the "LTS" version) installed once. Then, in Terminal, in this folder:

```
npm install
```

(only the first time), then:

```
npm start
```

Open http://localhost:8080 in your browser. The page refreshes every time you save a file. Press Ctrl+C in Terminal to stop.

## Publishing

The site is hosted on **Cloudflare Pages** (free plan) at **dawnbwalter.com**. Cloudflare publishes the site by itself every time a change reaches the `main` branch of your GitHub repository, and provides the secure padlock (SSL) for free.

You do the one-time setup below once. Create the accounts and type any passwords yourself. Allow about an hour, plus some waiting time for the domain (see Part 4).

### Part 1: Put the site on GitHub

1. Create a free account at [github.com](https://github.com).
2. Install [GitHub Desktop](https://desktop.github.com) and sign in with that account.
3. In GitHub Desktop, choose **File → Add Local Repository** and pick this folder. When it says the folder isn't a repository yet, click **create a repository**, keep the name `dawn-walter-portfolio`, and click **Create Repository**.
4. Click **Publish repository**. You can tick **Keep this code private**. It works either way.

### Part 2: Create the Cloudflare Pages project

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. In the left menu, go to **Workers & Pages**, click **Create**, choose the **Pages** tab, then **Connect to Git**.
3. Connect your GitHub account when asked. Give Cloudflare access to the `dawn-walter-portfolio` repository only, then select it and click **Begin setup**.
4. Fill in the build settings:
   - **Production branch:** `main`
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`
5. Click **Save and Deploy**. After a minute or two you'll have a working site at an address like `dawn-walter-portfolio.pages.dev`. Open it to check that everything looks right.

### Part 3: Move the domain's DNS to Cloudflare

This tells the internet that Cloudflare is now in charge of where dawnbwalter.com points. You keep the domain registered at Namecheap (renewals and domain privacy stay there) and don't need to buy anything.

1. In Cloudflare, click **Add a domain** (on the account home page). Type `dawnbwalter.com`, leave the DNS option on **Quick scan**, and continue.
2. Choose the **Free** plan.
3. Cloudflare shows the DNS records it found. Namecheap's "parking page" records (usually a `CNAME` for `www` pointing to `parkingpage.namecheap.com` and an `A` record or URL redirect for `@`) should be **deleted**, because the site will replace them. If you use Namecheap's free email forwarding, keep any `MX` and `TXT` records.
4. Cloudflare then shows two **nameservers**, like `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Yours will have different names. Keep this page open.
5. In another tab, sign in to [Namecheap](https://www.namecheap.com) and go to **Domain List**. Click **Manage** next to dawnbwalter.com.
6. Under **Advanced DNS**, check whether **DNSSEC** is on. If it is, turn it off first (you can turn it back on later from Cloudflare).
7. Back on the **Domain** tab, find **Nameservers**. Change it from "Namecheap BasicDNS" to **Custom DNS**, enter the two Cloudflare nameservers exactly, and click the green tick to save.
8. Return to Cloudflare and click **Check nameservers now**.

### Part 4: Wait for the switch

Nameserver changes take time to spread across the internet. It's usually somewhere between a few minutes and a few hours, but it can take **up to 24 to 48 hours**. Cloudflare emails you when dawnbwalter.com is **Active**. Nothing breaks while you wait. You can't do Part 5 until the domain is active.

### Part 5: Attach the domain to the site

1. In Cloudflare, go to **Workers & Pages** and open your `dawn-walter-portfolio` project.
2. Open the **Custom domains** tab and click **Set up a custom domain**.
3. Enter `dawnbwalter.com`, click **Continue**, then **Activate domain**. Cloudflare adds the DNS record for you.
4. Repeat steps 2 and 3 for `www.dawnbwalter.com`.
5. Each domain shows "Initializing" while Cloudflare sets up the secure certificate. This usually takes **5 to 15 minutes**, sometimes up to a day. When both say **Active**, https://dawnbwalter.com works.

### Part 6: Send www to the main address

So that www.dawnbwalter.com always ends up at dawnbwalter.com:

1. In Cloudflare, go back to the account home page and click **dawnbwalter.com**.
2. In the left menu, go to **Rules → Overview** and click **Create rule → Redirect Rule**.
3. Choose the template **Redirect from WWW to Root**. Check that it uses status **301**, that the target is `https://dawnbwalter.com`, and that **Preserve query string** is ticked.
4. Click **Deploy**.

To test it, open https://www.dawnbwalter.com/pricing-test/. It should change to https://dawnbwalter.com/pricing-test/.

### Every time you make a change

1. Edit and save the files in `content/` (and preview them if you like).
2. In GitHub Desktop, write a short summary of what you changed and click **Commit to main**.
3. Click **Push origin**. Cloudflare publishes the new version within a minute or two. You can watch it under **Workers & Pages → your project → Deployments**.

If a change breaks the build, Cloudflare keeps the previous version online. Open the failed deployment to read the error. It's usually a missing `-` or a colon that needs quotes.
