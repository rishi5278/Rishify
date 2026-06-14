/* ═══════════════════════════════════════════════════════════════
   WAVIFY — script.js
   Fully functional Music Player Dashboard
   ─────────────────────────────────────────────────────────────
   HOW TO ADD MORE SONGS:
   1. Add an object to the `songs` array below following the
      same structure: { title, artist, cover, src }
   2. For `cover`: use any image URL or a relative path like
      "covers/my-album.jpg" placed next to index.html.
   3. For `src`: point to any .mp3, .ogg, or .wav file. You can
      use freely-licensed audio from freemusicarchive.org or
      bensound.com, or host your own files.
   4. Save the file — the new song appears in the library
      immediately when the page reloads.
═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────
   SONG LIBRARY
   Using public-domain / CC-licensed demo tracks from Bensound
   (https://www.bensound.com) for demonstration purposes.
   Replace `src` values with your own audio files.
────────────────────────────────────────────────────────────── */
const songs = [
  {
    id: 1,
    title:  "Song 1",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song1/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title:  " Song 2",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song2/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title:  " Song 3",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song3/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title:  " Song 4",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song4/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title:  " Song 5",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song5/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: 6,
    title:  " Song 6",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song6/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: 7,
    title:  " Song 7",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song7/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: 8,
    title:  " Song 8",
    artist: "SoundHelix",
    cover:  "https://picsum.photos/seed/song8/200",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
];

/* ──────────────────────────────────────────────────────────────
   STATE
────────────────────────────────────────────────────────────── */
let currentIndex  = -1;      // index into `filteredSongs`
let isPlaying     = false;
let isMuted       = false;
let isShuffle     = false;
let repeatMode    = "none";  // "none" | "all" | "one"
let isDragging    = false;   // progress bar drag flag
let filteredSongs = [...songs];

// Persistent state from localStorage
let favorites    = JSON.parse(localStorage.getItem("wv_favorites") || "[]");   // array of song ids
let recentlyPlayed = JSON.parse(localStorage.getItem("wv_recent") || "[]");    // array of song ids (most recent first)

/* ──────────────────────────────────────────────────────────────
   DOM REFERENCES
────────────────────────────────────────────────────────────── */
const audio         = document.getElementById("audio-el");
const songList      = document.getElementById("song-list");
const favList       = document.getElementById("fav-list");
const recentList    = document.getElementById("recent-list");
const favEmpty      = document.getElementById("fav-empty");
const recentEmpty   = document.getElementById("recent-empty");

const playBtn       = document.getElementById("play-btn");
const prevBtn       = document.getElementById("prev-btn");
const nextBtn       = document.getElementById("next-btn");
const shuffleBtn    = document.getElementById("shuffle-btn");
const repeatBtn     = document.getElementById("repeat-btn");

const playerCover   = document.getElementById("player-cover");
const playerTitle   = document.getElementById("player-title");
const playerArtist  = document.getElementById("player-artist");
const playerFavBtn  = document.getElementById("player-fav-btn");

const progressTrack = document.getElementById("progress-track");
const progressFill  = document.getElementById("progress-fill");
const progressThumb = document.getElementById("progress-thumb");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl   = document.getElementById("total-time");

const volumeSlider  = document.getElementById("volume-slider");
const muteBtn       = document.getElementById("mute-btn");
const volWave1      = document.getElementById("vol-wave1");
const volWave2      = document.getElementById("vol-wave2");

const searchInput   = document.getElementById("search-input");
const filteredCount = document.getElementById("filtered-count");
const totalSongsLbl = document.getElementById("total-songs-label");
const toastContainer= document.getElementById("toast-container");
const themeToggle   = document.getElementById("theme-toggle");
const themeIcon     = document.getElementById("theme-icon");
const eqBars        = document.getElementById("eq-bars");
const trackLoading  = document.getElementById("track-loading");
const miniToggle    = document.getElementById("mini-toggle");
const playerBar     = document.getElementById("player-bar");
const sidebar       = document.getElementById("sidebar");
const sidebarClose  = document.getElementById("sidebar-close");
const sidebarOverlay= document.getElementById("sidebar-overlay");
const hamburger     = document.getElementById("hamburger");
const sectionTitle  = document.getElementById("section-title");

/* ──────────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────────── */
function init() {
  applyStoredTheme();
  renderLibrary();
  renderFavorites();
  renderRecent();
  totalSongsLbl.textContent = `${songs.length} song${songs.length !== 1 ? "s" : ""}`;
  audio.volume = volumeSlider.value / 100;
  updateVolumeIcon(volumeSlider.value);
}

/* ──────────────────────────────────────────────────────────────
   RENDER HELPERS
────────────────────────────────────────────────────────────── */

/** Build one <li> song item */
function buildSongItem(song, sourceIndex, listEl) {
  const isFav    = favorites.includes(song.id);
  const isActive = songs.indexOf(song) === getCurrentSongIndex();

  const li = document.createElement("li");
  li.className = `song-item${isActive ? " active" : ""}`;
  li.setAttribute("role", "listitem");
  li.dataset.songId = song.id;

  li.innerHTML = `
    <span class="song-num">${sourceIndex + 1}</span>
    <span class="song-play-icon" aria-hidden="true">
      ${isActive && isPlaying
        ? `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`}
    </span>
    <img class="song-thumb" src="${song.cover}" alt="${song.title} cover" loading="lazy"
         onerror="this.src='https://placehold.co/46x46/1e2235/a78bfa?text=♪'" />
    <div class="song-info">
      <p class="song-title">${escHtml(song.title)}</p>
      <p class="song-artist">${escHtml(song.artist)}</p>
    </div>
    <span class="song-duration" id="dur-${song.id}">—</span>
    <button class="fav-btn${isFav ? " faved" : ""}" aria-label="${isFav ? "Remove from favourites" : "Add to favourites"}" data-fav-id="${song.id}">
      <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    </button>
  `;

  // Click song row → play
  li.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) return; // let fav btn handle itself
    const globalIdx = songs.findIndex(s => s.id === song.id);
    if (globalIdx === -1) return;
    // Update filteredSongs to full list context for correct next/prev
    filteredSongs = getFilteredSongs();
    const fIdx = filteredSongs.findIndex(s => s.id === song.id);
    loadSong(fIdx, true);
  });

  // Favourite button
  li.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(song.id);
  });

  return li;
}

/** Render the main library list */
function renderLibrary() {
  filteredSongs = getFilteredSongs();
  songList.innerHTML = "";

  if (filteredSongs.length === 0) {
    songList.innerHTML = `<li class="empty-state"><p>No songs match your search.</p></li>`;
    filteredCount.textContent = "0 results";
    return;
  }

  filteredSongs.forEach((song, i) => {
    songList.appendChild(buildSongItem(song, i, songList));
  });

  // Show/hide count pill
  const isFiltered = document.getElementById("search-input").value.trim().length > 0;
  filteredCount.textContent = isFiltered ? `${filteredSongs.length} result${filteredSongs.length !== 1 ? "s" : ""}` : "";

  // Lazy-load durations
  loadDurations(filteredSongs);

  // Scroll active item into view
  const activeEl = songList.querySelector(".song-item.active");
  if (activeEl) activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/** Render favourites list */
function renderFavorites() {
  const favSongs = songs.filter(s => favorites.includes(s.id));
  favList.innerHTML = "";

  if (favSongs.length === 0) {
    favList.appendChild(favEmpty);
    favEmpty.style.display = "";
    return;
  }

  favSongs.forEach((song, i) => {
    favList.appendChild(buildSongItem(song, i, favList));
  });
  loadDurations(favSongs);
}

/** Render recently played list */
function renderRecent() {
  const recentSongs = recentlyPlayed
    .map(id => songs.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 20);

  recentList.innerHTML = "";

  if (recentSongs.length === 0) {
    recentList.appendChild(recentEmpty);
    recentEmpty.style.display = "";
    return;
  }

  recentSongs.forEach((song, i) => {
    recentList.appendChild(buildSongItem(song, i, recentList));
  });
  loadDurations(recentSongs);
}

/** Get songs matching search query */
function getFilteredSongs() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return [...songs];
  return songs.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q)
  );
}

/** Load durations via temp Audio objects (non-blocking) */
function loadDurations(songArr) {
  songArr.forEach(song => {
    const els = document.querySelectorAll(`#dur-${song.id}`);
    if (!els.length) return;
    const tmp = new Audio(song.src);
    tmp.addEventListener("loadedmetadata", () => {
      const d = formatTime(tmp.duration);
      document.querySelectorAll(`#dur-${song.id}`).forEach(el => el.textContent = d);
      tmp.src = ""; // release
    }, { once: true });
  });
}

/* ──────────────────────────────────────────────────────────────
   PLAYBACK
────────────────────────────────────────────────────────────── */

/** Load and optionally play a song by index in filteredSongs */
function loadSong(index, play = false) {
  if (filteredSongs.length === 0) return;

  // Clamp index
  if (index < 0) index = filteredSongs.length - 1;
  if (index >= filteredSongs.length) index = 0;

  currentIndex = index;
  const song = filteredSongs[currentIndex];

  // Show loading overlay
  trackLoading.classList.add("visible");
  playerCover.style.opacity = "0.4";

  // Set audio source
  audio.pause();
  audio.src = song.src;
  audio.load();

  // Update player UI
  playerCover.src    = song.cover;
  playerTitle.textContent  = song.title;
  playerArtist.textContent = song.artist;
  playerCover.onerror = () => {
    playerCover.src = "https://placehold.co/52x52/1e2235/a78bfa?text=♪";
  };

  // Favourite state on player
  updatePlayerFavBtn(song.id);

  // Mark recently played
  addToRecent(song.id);

  // Highlight in all lists
  highlightActive(song.id);

  // Reset progress
  progressFill.style.width = "0%";
  progressThumb.style.left = "0%";
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent   = "0:00";

  if (play) {
    audio.addEventListener("canplay", () => {
      audioPlay();
      trackLoading.classList.remove("visible");
      playerCover.style.opacity = "1";
    }, { once: true });
  } else {
    audio.addEventListener("loadedmetadata", () => {
      trackLoading.classList.remove("visible");
      playerCover.style.opacity = "1";
      totalTimeEl.textContent = formatTime(audio.duration);
    }, { once: true });
  }
}

function audioPlay() {
  audio.play().then(() => {
    isPlaying = true;
    updatePlayBtn();
    eqBars.classList.add("playing");
    trackLoading.classList.remove("visible");
    playerCover.style.opacity = "1";
  }).catch(() => {
    // Autoplay blocked — update UI but don't crash
    isPlaying = false;
    updatePlayBtn();
  });
}

function audioPause() {
  audio.pause();
  isPlaying = false;
  updatePlayBtn();
  eqBars.classList.remove("playing");
}

function togglePlayPause() {
  if (currentIndex === -1 && filteredSongs.length > 0) {
    loadSong(0, true);
    return;
  }
  if (isPlaying) audioPause();
  else audioPlay();
}

function playNext() {
  if (filteredSongs.length === 0) return;
  let next;
  if (isShuffle) {
    do { next = Math.floor(Math.random() * filteredSongs.length); }
    while (filteredSongs.length > 1 && next === currentIndex);
  } else {
    next = (currentIndex + 1) % filteredSongs.length;
  }
  loadSong(next, true);
}

function playPrev() {
  if (filteredSongs.length === 0) return;
  // If more than 3 seconds in, restart current
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const prev = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
  loadSong(prev, true);
}

/** Returns global index of currently playing song */
function getCurrentSongIndex() {
  if (currentIndex < 0 || !filteredSongs[currentIndex]) return -1;
  return songs.findIndex(s => s.id === filteredSongs[currentIndex].id);
}

/* ──────────────────────────────────────────────────────────────
   UI UPDATE HELPERS
────────────────────────────────────────────────────────────── */
function updatePlayBtn() {
  const iconPlay  = playBtn.querySelector(".icon-play");
  const iconPause = playBtn.querySelector(".icon-pause");
  iconPlay.style.display  = isPlaying ? "none"  : "block";
  iconPause.style.display = isPlaying ? "block" : "none";
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

function highlightActive(songId) {
  document.querySelectorAll(".song-item").forEach(el => {
    const active = parseInt(el.dataset.songId) === songId;
    el.classList.toggle("active", active);

    const playIcon = el.querySelector(".song-play-icon");
    if (playIcon && active) {
      playIcon.innerHTML = isPlaying
        ? `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    }
  });
}

function updatePlayerFavBtn(songId) {
  const isFav = favorites.includes(songId);
  playerFavBtn.classList.toggle("faved", isFav);
  playerFavBtn.setAttribute("aria-label", isFav ? "Remove from favourites" : "Add to favourites");
  const svg = playerFavBtn.querySelector("svg");
  svg.setAttribute("fill", isFav ? "currentColor" : "none");
}

/* ──────────────────────────────────────────────────────────────
   PROGRESS BAR
────────────────────────────────────────────────────────────── */
audio.addEventListener("timeupdate", () => {
  if (isDragging || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${pct}%`;
  progressThumb.style.left = `${pct}%`;
  progressTrack.setAttribute("aria-valuenow", Math.round(pct));
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

/** Seek by click position on the track */
function seekTo(e) {
  const rect = progressTrack.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
  progressFill.style.width = `${pct * 100}%`;
  progressThumb.style.left = `${pct * 100}%`;
}

progressTrack.addEventListener("mousedown", (e) => {
  isDragging = true;
  seekTo(e);
  const onMove = (ev) => seekTo(ev);
  const onUp   = () => {
    isDragging = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup",   onUp);
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup",   onUp);
});

// Touch support for progress bar
progressTrack.addEventListener("touchstart", (e) => {
  isDragging = true;
  seekTo(e.touches[0]);
}, { passive: true });
progressTrack.addEventListener("touchmove", (e) => {
  if (isDragging) seekTo(e.touches[0]);
}, { passive: true });
progressTrack.addEventListener("touchend", () => { isDragging = false; });

/* ──────────────────────────────────────────────────────────────
   VOLUME
────────────────────────────────────────────────────────────── */
volumeSlider.addEventListener("input", () => {
  const vol = volumeSlider.value / 100;
  audio.volume = vol;
  if (vol === 0) {
    isMuted = true;
    audio.muted = true;
  } else {
    isMuted = false;
    audio.muted = false;
  }
  updateVolumeIcon(volumeSlider.value);
  // Dynamic fill gradient
  volumeSlider.style.background = `linear-gradient(90deg, var(--violet) ${volumeSlider.value}%, var(--card) ${volumeSlider.value}%)`;
});

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  if (isMuted) {
    updateVolumeIcon(0);
  } else {
    updateVolumeIcon(volumeSlider.value);
  }
});

function updateVolumeIcon(val) {
  const v = parseInt(val);
  const muted = isMuted || v === 0;
  if (muted) {
    volWave1.style.display = "none";
    volWave2.style.display = "none";
  } else if (v < 50) {
    volWave1.style.display = "";
    volWave2.style.display = "none";
  } else {
    volWave1.style.display = "";
    volWave2.style.display = "";
  }
  muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  // Update slider fill
  volumeSlider.style.background = `linear-gradient(90deg, var(--violet) ${v}%, var(--card) ${v}%)`;
}

// Init volume fill
updateVolumeIcon(volumeSlider.value);

/* ──────────────────────────────────────────────────────────────
   SHUFFLE & REPEAT
────────────────────────────────────────────────────────────── */
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active-mode", isShuffle);
  shuffleBtn.title = isShuffle ? "Shuffle (on)" : "Shuffle (off)";
  showToast(isShuffle ? "🔀 Shuffle on" : "🔀 Shuffle off");
});

repeatBtn.addEventListener("click", () => {
  const modes = ["none", "all", "one"];
  repeatMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
  repeatBtn.classList.toggle("active-mode", repeatMode !== "none");

  const labels = { none: "Repeat off", all: "Repeat all", one: "Repeat one" };
  const icons  = {
    none: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
    all:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
    one:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/><text x="10" y="13" font-size="8" fill="currentColor" stroke="none">1</text></svg>`,
  };
  repeatBtn.innerHTML = icons[repeatMode];
  repeatBtn.title = labels[repeatMode];
  showToast(`🔁 ${labels[repeatMode]}`);
});

/* ──────────────────────────────────────────────────────────────
   AUDIO EVENTS
────────────────────────────────────────────────────────────── */
audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    audioPlay();
  } else if (repeatMode === "all" || filteredSongs.length > 1) {
    playNext();
  } else {
    isPlaying = false;
    updatePlayBtn();
    eqBars.classList.remove("playing");
  }
});

audio.addEventListener("play",  () => {
  isPlaying = true;
  updatePlayBtn();
  eqBars.classList.add("playing");
  if (currentIndex >= 0 && filteredSongs[currentIndex]) {
    highlightActive(filteredSongs[currentIndex].id);
  }
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayBtn();
  eqBars.classList.remove("playing");
});

/* ──────────────────────────────────────────────────────────────
   CONTROLS WIRING
────────────────────────────────────────────────────────────── */
playBtn.addEventListener("click",  togglePlayPause);
nextBtn.addEventListener("click",  playNext);
prevBtn.addEventListener("click",  playPrev);

/* ──────────────────────────────────────────────────────────────
   FAVOURITES
────────────────────────────────────────────────────────────── */
function toggleFavorite(songId) {
  const idx = favorites.indexOf(songId);
  if (idx === -1) {
    favorites.push(songId);
    showToast("❤️ Added to favourites");
  } else {
    favorites.splice(idx, 1);
    showToast("💔 Removed from favourites");
  }
  localStorage.setItem("wv_favorites", JSON.stringify(favorites));

  // Update all fav buttons with this song id
  document.querySelectorAll(`[data-fav-id="${songId}"]`).forEach(btn => {
    const isFav = favorites.includes(songId);
    btn.classList.toggle("faved", isFav);
    btn.setAttribute("aria-label", isFav ? "Remove from favourites" : "Add to favourites");
    const svg = btn.querySelector("svg");
    svg.setAttribute("fill", isFav ? "currentColor" : "none");
  });

  // Update player fav btn if currently playing
  if (currentIndex >= 0 && filteredSongs[currentIndex]?.id === songId) {
    updatePlayerFavBtn(songId);
  }

  renderFavorites();
}

playerFavBtn.addEventListener("click", () => {
  if (currentIndex < 0 || !filteredSongs[currentIndex]) return;
  toggleFavorite(filteredSongs[currentIndex].id);
});

/* ──────────────────────────────────────────────────────────────
   RECENTLY PLAYED
────────────────────────────────────────────────────────────── */
function addToRecent(songId) {
  recentlyPlayed = recentlyPlayed.filter(id => id !== songId);
  recentlyPlayed.unshift(songId);
  if (recentlyPlayed.length > 30) recentlyPlayed = recentlyPlayed.slice(0, 30);
  localStorage.setItem("wv_recent", JSON.stringify(recentlyPlayed));
  renderRecent();
}

/* ──────────────────────────────────────────────────────────────
   SEARCH
────────────────────────────────────────────────────────────── */
searchInput.addEventListener("input", () => {
  renderLibrary();
});

/* ──────────────────────────────────────────────────────────────
   SIDEBAR NAVIGATION
────────────────────────────────────────────────────────────── */
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const sec = link.dataset.section;

    // Update nav active
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Update visible section
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(`section-${sec}`).classList.add("active");

    // Update header title
    const titles = { library: "Library", favorites: "Favourites", recent: "Recently Played" };
    sectionTitle.textContent = titles[sec] || "Library";

    // Close sidebar on mobile
    closeSidebar();
  });
});

hamburger.addEventListener("click",     openSidebar);
sidebarClose.addEventListener("click",  closeSidebar);
sidebarOverlay.addEventListener("click",closeSidebar);

function openSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

/* ──────────────────────────────────────────────────────────────
   THEME TOGGLE
────────────────────────────────────────────────────────────── */
function applyStoredTheme() {
  const stored = localStorage.getItem("wv_theme") || "dark";
  document.documentElement.setAttribute("data-theme", stored);
  themeIcon.textContent = stored === "dark" ? "🌙" : "☀️";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("wv_theme", next);
  themeIcon.textContent = next === "dark" ? "🌙" : "☀️";
  showToast(next === "dark" ? "🌙 Dark mode" : "☀️ Light mode");
});

/* ──────────────────────────────────────────────────────────────
   MINI PLAYER TOGGLE
────────────────────────────────────────────────────────────── */
miniToggle.addEventListener("click", () => {
  playerBar.classList.toggle("mini");
  miniToggle.title = playerBar.classList.contains("mini") ? "Expand player" : "Mini player";
});

/* ──────────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
────────────────────────────────────────────────────────────── */
function showToast(message, duration = 2800) {
  const toast = document.createElement("div");
  toast.className = "toast";
  // Extract leading emoji as icon
  const match = message.match(/^(\p{Emoji}|\p{Extended_Pictographic})\s*/u);
  const icon  = match ? match[0] : "";
  const text  = match ? message.slice(match[0].length) : message;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${escHtml(text)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, duration);
}

/* ──────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUTS
────────────────────────────────────────────────────────────── */
document.addEventListener("keydown", (e) => {
  // Don't fire when typing in input
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlayPause();
      break;
    case "ArrowRight":
      e.preventDefault();
      playNext();
      break;
    case "ArrowLeft":
      e.preventDefault();
      playPrev();
      break;
    case "ArrowUp": {
      e.preventDefault();
      const newVol = Math.min(100, parseInt(volumeSlider.value) + 5);
      volumeSlider.value = newVol;
      audio.volume = newVol / 100;
      updateVolumeIcon(newVol);
      break;
    }
    case "ArrowDown": {
      e.preventDefault();
      const newVol = Math.max(0, parseInt(volumeSlider.value) - 5);
      volumeSlider.value = newVol;
      audio.volume = newVol / 100;
      updateVolumeIcon(newVol);
      break;
    }
    case "KeyM":
      muteBtn.click();
      break;
    case "KeyS":
      shuffleBtn.click();
      break;
    case "KeyR":
      repeatBtn.click();
      break;
  }
});

/* ──────────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────────── */

/** Format seconds as m:ss */
function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Escape HTML to prevent XSS */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ──────────────────────────────────────────────────────────────
   BOOT
────────────────────────────────────────────────────────────── */
init();
