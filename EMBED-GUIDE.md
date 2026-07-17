# Scholars@Harvard embed guide

Nine self-contained pages, one per section of your site. Each is a standalone
`.html` file with all CSS inlined and no external dependencies. They are
theme-aware (follow the viewer's light/dark OS setting) and responsive.

## Step 1 — Host the files

Pick one free static host and upload this whole `embeds/` folder:

- **GitHub Pages** — create a repo, push these files, enable Pages. Your files
  land at `https://<user>.github.io/<repo>/about.html`, etc.
- **Netlify / Cloudflare Pages** — drag-and-drop the `embeds/` folder; you get a
  URL like `https://<name>.netlify.app/about.html`.

After hosting, note your base URL (everything before the filename). Below it is
written as `BASE`.

## Step 2 — Embed each section in Scholars

In the Scholars editor, add an **Embed / HTML** element on the relevant page and
paste the matching snippet. Replace `BASE` with your hosted URL.

> Heights are fixed because Scholars strips the auto-resize script. The values
> below fit a ~760px-wide column; if your column is narrower the text reflows
> taller, so nudge the height up if you see an inner scrollbar.

| Section | File | Suggested `height` |
|---|---|---|
| About | `about.html` | 1300 |
| Education & Training | `education.html` | 820 |
| Research (map + projects) | `research.html` | 1850 |
| Looking Ahead | `looking-ahead.html` | 800 |
| Publications | `publications.html` | 2750 |
| Clinical Practice | `clinical.html` | 920 |
| Teaching | `teaching.html` | 850 |
| Media & Outreach | `media.html` | 1420 |
| Contact | `contact.html` | 920 |

Snippet (change filename + height per row):

```html
<iframe src="BASE/about.html"
        style="width:100%; height:1300px; border:0; overflow:hidden"
        loading="lazy" title="About — Mayron Piccolo"></iframe>
```

## If Scholars refuses the iframe

Some Scholars page types sanitize `<iframe>`. If the embed element strips it:

1. Ask your Scholars page be set to a type that allows an HTML/embed block, or
2. Fall back to linking: put a button/link to `BASE/research.html` instead of
   embedding it. The interactive map still works when opened directly.

## Notes

- `research.html` and `publications.html` contain the small scripts that draw the
  map and build the publication list. The other seven are static HTML.
- To update content later, edit `../mayron-piccolo-site.html` (the full site) and
  re-run the split, or edit these files directly.
