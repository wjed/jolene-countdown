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

## The pixel world

Pressing the two sprites in the masthead wipes the screen out and opens a
240x160 overworld — Game Boy Advance resolution, integer-scaled to fill the
viewport. Thirteen areas: her apartment, campus, the drive south, Northern
Virginia and seven shops you can walk into, plus his house and Scale AI.

The maps, tiles, sprites, font and cast are all generated rather than written
by hand. The generators live outside this repo and emit one block of data that
gets spliced into `index.html`:

- `sprites.py` — 16x22 characters as pixel rows. Six human silhouettes and a
  dog; everyone else is one of those with a different palette.
- `font.py` — the 4x5 capitals the in-world signage is lettered with.
- `font2.py` — a 5x9 proportional face with real lower case and descenders,
  for the speech box. Each glyph is trimmed to its own ink, so an `i` does not
  take the same room as an `M`.
- `genworld.py` — tiles, maps, warps, dialogue, the cast, and each area's
  roam mask.
- `validate.py` — reachability and integrity checks. It fails the build for a
  sealed-off shop, a door that isn't a door, a sign nobody can read, a
  character with a missing facing, or two people on one screen who look too
  alike.

Two rules keep the moving characters from breaking the world. A **roam mask**
per area lists the tiles anyone who walks is allowed to stand on — computed by
removing each tile in turn and checking whether the map falls into two pieces,
so doorways and corridors are excluded. On top of that, no character may take
a step that leaves the player unable to reach an exit; that one is checked at
the moment of the step, because two bodies can close a gap that neither closes
alone.

Every frame of a walk cycle inks exactly the same columns. When they didn't,
the whole lower body slid sideways once per step and it read as a shake rather
than a walk.

### What it borrows from the games it is copying

Gen 3 splits a map across background layers and puts tall scenery on one that
objects pass *behind*. Everything here used to draw in a single plane, so a
sprite always won and her head sat on top of the tree she was standing under.
`TOPT` lists the tiles that get a second pass after the sprites, and how much
of the tile that pass covers — the whole thing for a tree, the bottom half for
tall grass, which swallows your legs instead.

Other things those games do that this now does:

- **Speech is drawn in the world**, in the game's own font, a character at a
  time, with the blinking arrow that means press A. It used to be an HTML
  paragraph laid over the canvas — wrong typeface, wrong pixel grid, no
  reveal.
- **You turn before you walk.** Emerald walks at 16 frames a tile and spends 8
  turning on the spot first. That delay is most of why those games feel
  deliberate rather than slippery. Hold shift to run.
- **Water and flowers move.** A static surface is the loudest tell that a
  scene is a picture rather than a place.
- **Ledges** you drop off and cannot climb back up.
- **The sky follows the clock** — dawn, golden hour, dusk and night tint the
  outdoor areas from the viewer's own time of day. Indoors the lights are on.
- **It remembers where you were**, so reopening puts you back rather than at
  the start. Never onto a doorway, or she would warp the instant it opened.
