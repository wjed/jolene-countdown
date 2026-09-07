# will + jolene

A single-page site for Jolene. Countdown to the next visit, the photos, the
notes, the bucket list, and the rest of it.

No build step, no framework, no dependencies. Open `index.html` and it works.

## Files

| Path | What it is |
|------|------------|
| `index.html` | The whole site — markup, content and one inline `<script>` |
| `css/style.css` | Every style, including both palettes |
| `images/` | The photos, 80 of them |
| `school_logos/`, `gyms/`, `fonts/` | Left over from an older version, unused |

## Content lives in the markup

There is no CMS and no data file. Everything editable is a plain array or
object near the top of the `<script>` in `index.html`:

- `QA` — the prose the sheets render, including the photo list
- `JOLENE` / `JOLENE_LINES` — the facts, and the rotating one on her tile
- `BUCKET` — the bucket list. Add `done: 'where it happened'` to an entry and
  it moves to the Done section; the count, the bar and the tile all follow
- `NEXT_VISIT`, `ANNIV_*`, `BDAY_*` — the dates every counter derives from

## Photos

Filenames follow `Category_Description.jpg`, with `_01`/`_02` where several
photos share a description, so the category sorts them into their event:

`Date` `Early` `Everyday` `Family` `FirstDate` `Gym` `Home` `JMU` `LakeAnna`
`Milestone` `PSU` `Pets`

The gallery list in `QA.photos` is generated from what is actually on disk. If
you add or rename photos, it has to be regenerated or the page will point at
files that no longer exist.

## Birthday mode

Tapping the birthday tile sets `data-party="on"` on `<html>`. That swaps the
palette tokens only — every component follows automatically. The fire in the
bridge animation and the two portraits deliberately keep literal colours, so
they don't turn pink along with everything else.
