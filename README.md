# will + jolene

A shared site for the two of you: countdown to the next visit, messages, lifts, mood, photos, notes, timeline, weather, distance, and music.

## Pages

- **index.html** — Home: countdown to March 12, 2026, live time, moon phase, school logos, and links to everything.
- **messages.html** — Send and read messages (Supabase).
- **lifts.html** — Log which muscle groups you hit (JMU UREC · Penn State).
- **mood.html** — How you’re feeling (1–10 + optional note).
- **photos.html** — Photo gallery.
- **notes.html** — Static notes.
- **timeline.html** — Your timeline.
- **weather.html** — Weather for Harrisonburg & State College.
- **distance.html** — Map and distance JMU ↔ Penn State.
- **music.html** — Spotify playlists.

## Logo images

Put your logos in the `images/` folder with these names so they show up:

| File | Where it’s used |
|------|------------------|
| `jmu-logo.png` | Home (school logos) |
| `penn-state-logo.png` | Home (school logos) |
| `urec-logo.png` | Lifts page (Will’s gym – JMU UREC) |
| `penn-gym-logo.png` | Lifts page (Jolene’s gym – Penn State) |

You can use `.png`, `.jpg`, or `.svg`; if the filename differs, rename the file or update the `src` in `index.html` and `lifts.html`.

## Supabase

1. Run **supabase_tables.sql** in the Supabase SQL Editor (creates `messages`, `lifts`, `mood` and RLS).
2. Your project URL and anon key are in **js/shared.js**. Messages, lifts, and mood all use that.

## Running it

Open **index.html** in a browser, or host the folder (e.g. GitHub Pages, Netlify) and use the site from the same URL so you both see the same data.
