# will + jolene

A single-page site for Jolene. Countdown to the next visit, the photos, the
notes, the bucket list, and the rest of it.

No build step, no framework, no dependencies. Open `index.html` and it works.

## Files

| Path | What it is |
|------|------------|
| `index.html` | The whole site — markup, content and one inline `<script>` |
| `css/style.css` | Every style, including both palettes |
| `images/` | The photographs, 88 of them, full size |
| `images/thumbs/`, `images/web/` | What the page actually loads — made by `tools/photos.py` |
| `tools/photos.py` | Rebuilds those two after photographs are added |
| `school_logos/`, `gyms/`, `fonts/` | Left over from an older version, unused |

## The page

One card style, used for everything, read the same way down: label, value,
detail. In order:

1. **The countdown to the next visit** — the only thing counting seconds.
2. **A photograph**, beside the countdown on a desktop.
3. **What he is doing right now**, and **his latest note**.
4. **The list** — one open thing off it — and **the two small numbers**, days
   together and days to her birthday, in one card.
5. **The things to read**, as a list.

On a phone that is one column. On a desktop the cards pair up five columns and
seven on every row of a twelve-column grid, so the gutter runs straight down. The sprites in
the masthead are the one way into the pixel world.

## Content lives in the markup

There is no CMS and no data file. Everything editable is a plain array or
object near the top of the `<script>` in `index.html`:

- `QA` — the prose the sheets render, including the photo list
- `JOLENE` / `JOLENE_LINES` — the facts, and the rotating one under About Jolene
- `BUCKET` — the bucket list. Add `done: 'where it happened'` to an entry and
  it moves to the Done section; the count, the bar and the block all follow
- `NEXT_VISIT`, `NEXT_VISIT_DAYS` (how many calendar days the visit spans, counting the day it starts; the countdown says it's here and the "right now" card says he's with her for exactly that long), `ANNIV_*`, `BDAY_*` — the dates every counter derives from

## Photos

Filenames follow `Category_Description.jpg`, with `_01`/`_02` where several
photos share a description, so the category sorts them into their event:

`Date` `Early` `Everyday` `Family` `FirstDate` `Gym` `Home` `JMU` `LakeAnna`
`Milestone` `PSU` `Pets`

The gallery list in `QA.photos` is generated from what is actually on disk. If
you add or rename photos, it has to be regenerated or the page will point at
files that no longer exist.

### Two smaller copies of each one

The originals are keepsakes at up to a megabyte each, and the page never loads
them. `tools/photos.py` makes `images/thumbs` (480px, for the gallery grid)
and `images/web` (1000px, for the photograph on the front page and the full
view). Run it after adding photographs:

```
python tools/photos.py
```

It matters more than it sounds. The photograph on the front changes every
seven seconds; at full size that was half a megabyte each time, on her phone,
on her data. Scrolling the whole gallery was forty megabytes. It is now about
110KB a change and 27KB a thumbnail. Paths are derived by name, so a photograph
whose copies were never built falls back to the original rather than leaving a
hole in the grid.

### Tapping one

The gallery is thumbnails, and a tap opens the photograph over the top of it:
arrows, the arrow keys or a swipe for the next one, escape or the space around
it to come back. It shows the `web` copy, not the original.

## Birthday mode

Tapping the birthday line sets `data-party="on"` on `<html>`. That swaps the
palette tokens only — every component follows automatically. The fire in the
bridge animation and the two portraits deliberately keep literal colours, so
they don't turn pink along with everything else.

## The pixel world

Pressing the two sprites in the masthead wipes the screen out and opens a
240x160 overworld — Game Boy Advance resolution, integer-scaled to fill the
viewport. Eighteen areas: her apartment, campus, the drive south, Northern
Virginia, Lake Anna, the shops and the photobooth, his house and Scale AI —
and the way they got to the concert in September: the station on the Virginia
map, the platform under it, the train itself, and the street in DC with the
Kennedy Center on it and the Potomac behind it. The hall used to stand next to
the photobooth in Virginia, which is the wrong side of the river; it is where
it belongs now, and getting to it is a ride.

The maps, tiles, sprites, font and cast are all generated rather than written
by hand. The generators lived outside this repo and emitted one block of data
that was spliced into `index.html`. They are gone now, so that spliced data is
the only copy: a new area is edited into `index.html` by hand, and everything it
touches - the tile art, the maps, the roam masks - kept consistent by hand with
it. What they did:

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

What draws over a character is decided by the ground it is standing on. In a
top-down view a wall or a tree one tile north of you is *behind* you, so those
never cover anybody — an earlier version redrew every tall tile over whoever
overlapped it, which tucked her head behind shopfronts and tree lines she was
standing in front of. Two things do cover you, drawn straight after each sprite
in depth order: tall grass round your legs, and a tree canopy you have walked
into, which hides you from the shoulders down. Trees are built the way Gen 3
builds them — a solid trunk with a walkable canopy above — so you can stand
behind one. `TOPT` holds the band of each covering tile. Signs are scenery too,
so they go down before the people standing under them.

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

### The start menu, and something to find

Everything in those games hangs off one button. Enter (or the start control)
opens a menu drawn in the world:

- **The list** — the bucket list the rest of the site is about, ticked off,
  read straight from the same `BUCKET` data the page uses.
- **Places** — every area, ticked as you reach them, the one you are standing
  in picked out, and a line saying where that is. She said more than once that
  she never knew where she was.
- **Moments** — one thing to find in every area, picked up by walking onto it.
- **Leave.**

Places and Moments are two columns of eight, sixteen to a screen, and a page at
a time past that — the eighteenth area is what made paging necessary, and it is
the same up-and-down the list page already used, with the same little arrows.
A name still has to measure under `PX_NAMEW` or it runs into the next column;
`genworld.py` used to fail the build over that, and now nothing does, which is
why Reston Town Center is listed as Reston.

Small feedback, from the same reference: a puff of dust under a running foot, a
green one out of tall grass, and walking on the spot, with a thud if sound is on, when you walk into a wall.

### What gets said

Every line in the world is about Jolene, Will, or the two of them, or it is not
said at all. The lines come from what the rest of the site already knows: how
they met, the timeline, his notes, her details, the list, and the photographs.
No invented habits, orders or opinions.

Only people who actually know them speak: Elsie and Sophie, her classmates, his
mom, Will, a coworker, and the dogs. Shop staff and passers-by are there for
the life of the place and have nothing to say (`None` for their lines in
`genworld.py`), so they don't look up with a `!` or answer when spoken to. The
only water with a line is the lake, and the line is night swimming, off the
list.

### People, and the small stuff

- **Bubbles over heads**, the way Stardew does it: people with something to say
  look up with a `!` the first time she comes near on a visit, a dog gets a
  heart, and finding something puts a note over her own head.
- **Everyone blinks**, each on their own rhythm, worked out from the clock and
  their name rather than a timer per person.
- **A dog follows in her footsteps**, like a walking Pokemon in HeartGold: each
  step it takes the shortest route to her over ground it may stand on, and on
  that route prefers her own footprints. It never takes a step that does not
  bring it closer.
- **Footprints in the sand** at Lake Anna, fading after a couple of seconds.
- **Doors open** as she walks into them, before the screen goes dark.
- **Sound, off unless she turns it on** in the menu: a blip per letter pitched
  per speaker, the way EarthBound and Undertale give characters a voice, plus a
  thud for walking into a wall and a chime for finding something.

Keyboard focus sits on the game surface rather than on a button, and returns
there after any on-screen control, so Space and Enter only ever mean the game.
Ctrl, Cmd and Alt combinations are left to the browser.

### On a phone

On a touch screen (and in a small window) the controls get room of their own
instead of floating faded over the map:

- **Upright**, the screen sits above and the controls below, the way a handheld
  is laid out. **Sideways**, the screen sits between two thumb columns. Every
  edge keeps clear of the notch and the home indicator.
- **The d-pad is one surface.** Press anywhere on it and roll onto another arrow
  without lifting; the middle keeps whichever way you were going. Four separate
  buttons could not do that — a touch stays with the element it started on.
- **A, B and start act on the press**, not the release. **B** backs out of a
  menu page, then out of the menu, and moves speech along; held, it runs. The
  `b` key does the same. A tap on the screen also moves speech along.
- The game does not pan or zoom the page behind it, a long press selects
  nothing, and the close button reads "exit" rather than "esc".

### Movement

Steps chain: the next one starts on the exact frame the last one ends, because
the render loop runs the same step check as the 40ms logic tick. With the tick
alone, ordinary browser timer jitter left a small freeze before almost every
step. Turning a corner while walking carries straight on — the turn-in-place
pause only applies from standing still. The walk cycle is step, stand, other
step, stand, the pattern sprite RPGs use; holding one stepping pose for a whole
tile read as legs shaking. Pressing into a wall walks on the spot. A or start
pressed mid-step waits until she stops, arriving at a tile always runs its
checks before the next step can begin, and leaving the window lets go of every
key. Characters who pace walk their whole beat and pause at the ends.
