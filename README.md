# Rishify
🎵 A modern Music Player Dashboard built with pure HTML, CSS &amp; Vanilla JS. Features dark/light mode, favourites , recently played, shuffle, repeat, keyboard shortcuts and more.

# 🎵 Rishify — Music Player Dashboard

A modern, fully responsive Music Player Dashboard built with pure **HTML**, **CSS**, and **Vanilla JavaScript** — no frameworks, no dependencies.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

### 🎛️ Player Controls
- Play / Pause / Previous / Next track
- Shuffle mode
- Repeat modes — Off → Repeat All → Repeat One
- Seekable progress bar (click or drag)
- Volume slider with mute/unmute toggle

### 🎨 UI & Design
- Glassmorphism dark theme with violet + amber accents
- Fully responsive — desktop, tablet, and mobile
- Collapsible sidebar navigation
- Animated equalizer bars while playing
- Loading spinner when switching tracks
- Mini-player mode (compact bottom bar)
- Smooth transitions and hover animations

### 📚 Music Library
- Song list with album art, title, artist, and duration
- Real-time search — filter by title or artist
- Active song highlighting

### ❤️ Favourites
- Mark / unmark songs as favourites
- Persisted in `localStorage` — survives page refresh

### 🕐 Recently Played
- Automatically tracks last 30 played songs
- Persisted in `localStorage`

### 🌙 Dark / Light Mode
- Toggle between dark and light themes
- Preference saved in `localStorage`

### 🔔 Toast Notifications
- Non-intrusive pop-ups for: favourites, theme changes, shuffle/repeat mode

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Next track |
| `←` | Previous track |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Mute / Unmute |
| `S` | Toggle Shuffle |
| `R` | Cycle Repeat mode |

---

## 📁 Project Structure

```
wavify/
├── index.html      # App structure and markup
├── style.css       # All styling, themes, and animations
├── script.js       # All logic — player, state, localStorage
└── README.md
```

---

## 🚀 Getting Started

### Option 1 — Open directly (simplest)

Just open `index.html` in your browser. Works out of the box with the demo audio URLs already in `script.js`.

### Option 2 — Run a local server (recommended for custom audio)

## ➕ How to Add Songs

Open `script.js` and add objects to the `songs` array at the top of the file:

```js
const songs = [
  {
    id: 1,                           // Must be unique
    title:  "My Song",
    artist: "Artist Name",
    cover:  "covers/my-album.jpg",   // Image URL or local path
    src:    "audio/my-song.mp3",     // Audio URL or local path
  },
  // Add more songs here...
];
```

**Tips:**
- Use any `.mp3`, `.ogg`, or `.wav` file
- For local files, place them next to `index.html` in a subfolder (e.g. `audio/`)
- For online files, make sure the server allows CORS (e.g. [SoundHelix](https://www.soundhelix.com/), your own CDN)
- Album art can be any image URL — [picsum.photos](https://picsum.photos) works great for placeholders

---

## 🎵 Demo Audio Sources (CORS-friendly)

The project ships with [SoundHelix](https://www.soundhelix.com) tracks which stream directly in the browser:

```
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
...up to SoundHelix-Song-17.mp3
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 Audio API | Playback engine |
| CSS Custom Properties | Theming (dark/light) |
| CSS Grid & Flexbox | Layout |
| `localStorage` | Favourites, recents, theme |
| Vanilla JS ES6+ | All app logic |
| Google Fonts | Space Grotesk + Inter |

---

## 📸 Sections

| Section | Description |
|---------|-------------|
| **Library** | Full song list with search |
| **Favourites** | Heart-marked songs, persisted |
| **Recently Played** | Auto-tracked play history |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| `> 900px` | Full sidebar + player bar |
| `≤ 900px` | Hamburger menu, compact player |
| `≤ 600px` | Stacked player bar, touch-friendly |

---

## 📱 screenshots
![image 1](<Screenshot 2026-06-14 105231.png>)
![image 2](<Screenshot 2026-06-14 105244.png>)
![image 3](<Screenshot 2026-06-14 105302.png>)
![image 4](<Screenshot 2026-06-14 105316.png>)
![image 5](<Screenshot 2026-06-14 105348.png>)

## 🙏 Credits

- Demo audio: [SoundHelix](https://www.soundhelix.com)
- Placeholder images: [Picsum Photos](https://picsum.photos)
- Fonts: [Google Fonts](https://fonts.google.com) — Space Grotesk & Inter
- Icons: Inline SVG (no external icon library needed)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ using only HTML, CSS, and Vanilla JavaScript


 ## authors:
  name : Rishi sharma
  intern id :CITS2084
