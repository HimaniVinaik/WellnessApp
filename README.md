# Mental Wellness

A calm, minimal iPhone web app for brain training, meditation and mindful
habit-building. It installs to your Home Screen like a native app and stores
your data locally on-device, with an optional encrypted backup to your own
GitHub repository.

## Features

- **Habits & To-dos** — daily habits with streak tracking, a lightweight
  to-do list, and custom points per check-in.
- **Skill Mastery** — pick skills to master; check in daily and "master" a
  skill after 20 consecutive days.
- **Brain Training** — three well-designed games: N-Back (working memory),
  Memory Match (card pairs), and Mental Math (timed arithmetic).
- **Meditation** — a breathing timer with six ambient soundscapes (rain,
  ocean, forest wind, singing bowl, white noise, silence) synthesized live
  with the Web Audio API — no audio files to download.
- **Reading Room** — pulls thoughtful essays from Aeon, The Marginalian,
  Nautilus and Longreads (via their public RSS feeds), with a distraction-free
  serif reading mode, save-for-later and read tracking.
- **Gamification** — every habit/skill check-in earns points (you choose how
  many per habit). Every 1000 points levels you up, and you name each level
  yourself in the Profile tab.
- **Encrypted GitHub backup** — save your data as an AES-256-GCM encrypted
  CSV file, committed to a GitHub repo of your choosing, using a personal
  access token and passphrase that never leave your device except to talk to
  GitHub's API.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Open the dev server URL on your iPhone (or in a mobile viewport in your
browser), then use Safari's Share → **Add to Home Screen** to install it as a
standalone app.

## Hosting on GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and deploys the app to GitHub Pages on every push to `main`.

1. In the repo settings, go to **Pages** and set the source to **GitHub
   Actions**.
2. Push to `main` — the workflow builds the app and publishes `dist/` to
   Pages automatically.
3. Your app will be live at `https://<your-username>.github.io/WellnessApp/`.

## Saving your data to GitHub

In the **Profile** tab, under "Backup to GitHub":

1. Create a [fine-grained personal access token](https://github.com/settings/tokens)
   with read/write access to Contents on the repo you want to use for backups.
2. Enter the repo owner, name, branch and a file path (defaults to
   `data/wellness-data.csv`).
3. Choose an encryption passphrase — this is used to encrypt your data with
   AES-256-GCM before it's ever sent anywhere. Only you know it; it is not
   recoverable if lost.
4. Tap **Save to GitHub** to commit an encrypted snapshot, or **Load from
   GitHub** to restore from one.

The token and passphrase are stored only in your browser's local storage on
your device.
