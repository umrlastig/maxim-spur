# Maxim Spur — LASTIG personal page

Static Bootstrap site in `index.html`, published from `gh-pages`. Read [README](README.md) for the template and features, and [CODEX_MEMO](CODEX_MEMO.md) for source conventions and recurring gotchas.

- Preview: `python3 -m http.server 8000 --bind 127.0.0.1`; open `http://127.0.0.1:8000/` in the in-app browser. JSON/publication requests require HTTP.
- Profile text/layout lives in `index.html`; styles in `css/resume.css` and `css/extras.css`; language selection in `js/resume.js`.
- Check English and French after profile edits. Match `.lang-en` / `.lang-fr` and select visibility from the current selector value, rather than toggling from its previous value.
- The Software development subsection links to `visibility-lab.html`. This portable HTML is a copied V4 release from the separate Intervisibility project; `visibility-lab.source.json` records the exact source revision and hashes. Do not edit the copied lab manually or assume it tracks newer source changes automatically.
- Use `git diff --check`, browser inspection of changed sections, and a local lab-link smoke check before release. Preview work remains uncommitted until the user approves it. Pushing `gh-pages` publishes through the existing Pages setup.
