/**
 * mnhutzt Portfolio
 */

// Playlist
const playlist = [
    { name: 'Mạc Vấn Quy Kỳ', artist: '蒋雪儿', file: './music/song1.mp3' },
    { name: 'Nắng Có Mang Em Về', artist: 'Shartnuss, Tr.D và Phankeo', file: './music/song2.mp3' }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isMusicUnlocked = false;

// Elements
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trackTitleEl = document.getElementById('trackTitle');
const trackArtistEl = document.getElementById('trackArtist');
const trackVinyl = document.getElementById('trackVinyl');
const audioWaves = document.getElementById('audioWaves');

const autoplayUnlock = document.getElementById('autoplayUnlock');
const unlockMusicBtn = document.getElementById('unlockMusicBtn');
const skipMusicBtn = document.getElementById('skipMusicBtn');
const mainContainer = document.getElementById('mainContainer');
const musicPlayer = document.getElementById('musicPlayer');

const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');
const volumePercentText = document.getElementById('volumePercentText');

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Theme Switcher
const themeToggle = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
const colorOptions = document.querySelectorAll('.color-option');
const modeButtons = document.querySelectorAll('.mode-btn');
const weatherButtons = document.querySelectorAll('.weather-btn');

/* Tab Navigation */
function switchSection(sectionId) {
    sections.forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        switchSection(sectionId);
    });
});

// Shortcuts: 1-Home, 2-About, 3-Skills, 4-Projects, 5-Contact
document.addEventListener('keydown', (e) => {
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
    const keyMap = {
        '1': 'home',
        '2': 'about',
        '3': 'skills',
        '4': 'projects',
        '5': 'contact'
    };
    if (keyMap[e.key]) {
        switchSection(keyMap[e.key]);
    }
});

/* Welcome & Autoplay Handler */
function enterSite(playWithAudio = true) {
    isMusicUnlocked = true;
    localStorage.setItem('musicUnlocked', 'true');

    if (autoplayUnlock) autoplayUnlock.classList.add('hidden');
    if (mainContainer) mainContainer.classList.add('show');

    if (playWithAudio) {
        loadTrack(0);
        if (volumeSlider) {
            const val = volumeSlider.value || 70;
            audio.volume = val / 100;
            if (volumePercentText) volumePercentText.textContent = val + '%';
        }
        playMusic();
    } else {
        loadTrack(0);
        if (volumeSlider) {
            const val = volumeSlider.value || 70;
            audio.volume = val / 100;
            if (volumePercentText) volumePercentText.textContent = val + '%';
        }
    }
}

if (unlockMusicBtn) {
    unlockMusicBtn.addEventListener('click', () => enterSite(true));
}

if (skipMusicBtn) {
    skipMusicBtn.addEventListener('click', () => enterSite(false));
}

if (localStorage.getItem('musicUnlocked') === 'true') {
    if (autoplayUnlock) autoplayUnlock.style.display = 'none';
    if (mainContainer) mainContainer.classList.add('show');
    loadTrack(0);
}

/* Audio Player */
function loadTrack(index) {
    if (playlist[index]) {
        currentTrackIndex = index;
        audio.src = playlist[index].file;
        if (trackTitleEl) trackTitleEl.textContent = playlist[index].name;
        if (trackArtistEl) trackArtistEl.textContent = playlist[index].artist;
    }
}

function playMusic() {
    if (!audio.src) loadTrack(0);
    audio.play().then(() => {
        isPlaying = true;
        updatePlayerUI(true);
    }).catch(err => {
        console.log('Autoplay blocked:', err);
        isPlaying = false;
        updatePlayerUI(false);
    });
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
    updatePlayerUI(false);
}

function updatePlayerUI(playing) {
    if (playIcon) {
        playIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
    if (trackVinyl) {
        if (playing) trackVinyl.classList.add('spinning');
        else trackVinyl.classList.remove('spinning');
    }
    if (audioWaves) {
        if (playing) audioWaves.classList.add('playing');
        else audioWaves.classList.remove('playing');
    }
}

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (isPlaying) pauseMusic();
        else playMusic();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playMusic();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playMusic();
    });
}

// Track Progress
if (audio) {
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressFill) progressFill.style.width = percent + '%';
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration) && durationEl) {
            durationEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('ended', () => {
        if (nextBtn) nextBtn.click();
    });
}

if (progressBar) {
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        if (!isNaN(audio.duration)) {
            audio.currentTime = percent * audio.duration;
        }
    });
}

function formatTime(time) {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Volume Controls
if (volumeBtn && volumeControl) {
    volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        volumeControl.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.volume-container')) {
            volumeControl.classList.remove('show');
        }
    });
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        audio.volume = val / 100;

        if (volumePercentText) {
            volumePercentText.textContent = val + '%';
        }

        if (volumeIcon) {
            if (val == 0) volumeIcon.className = 'fa-solid fa-volume-xmark';
            else if (val < 50) volumeIcon.className = 'fa-solid fa-volume-low';
            else volumeIcon.className = 'fa-solid fa-volume-high';
        }
    });
}

/* Discord Presence (Lanyard API) */
const discordUserId = '1066597531951300658';
const discordAvatar = document.getElementById('discordAvatar');
const discordUsername = document.getElementById('discordUsername');
const discordHandleText = document.getElementById('discordHandleText');
const discordStatusRing = document.getElementById('statusRing');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statusSubText = document.getElementById('statusSubText');
const actThumbWrap = document.getElementById('actThumbWrap');
const actThumbImg = document.getElementById('actThumbImg');
const heroStatusIndicator = document.getElementById('heroStatusIndicator');
const discordHandleText2 = document.getElementById('discordHandleText2');

async function fetchDiscordPresence() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        const body = await res.json();

        if (!res.ok || !body.success || !body.data) {
            throw new Error('Lanyard data unavailable');
        }

        const data = body.data;
        const user = data.discord_user;
        const status = data.discord_status || 'offline';

        // Avatar
        if (discordAvatar) {
            if (user.avatar) {
                const isAnimated = user.avatar.startsWith('a_');
                const ext = isAnimated ? 'gif' : 'png';
                discordAvatar.src = `https://cdn.discordapp.com/avatars/${discordUserId}/${user.avatar}.${ext}?size=128`;
            } else {
                discordAvatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            }
        }

        // Profile Info
        const displayName = user.global_name || user.username || 'Người Tình Mùa Đông';
        if (discordUsername) discordUsername.textContent = displayName;
        if (discordHandleText) discordHandleText.textContent = `@${user.username}`;
        if (discordHandleText2) discordHandleText2.textContent = `@${user.username}`;

        // Status State
        let statusName = 'Ngoại tuyến';
        let statusClass = 'offline';

        if (status === 'online') {
            statusClass = 'online';
            statusName = 'Trực tuyến';
        } else if (status === 'idle') {
            statusClass = 'idle';
            statusName = 'Đang chờ';
        } else if (status === 'dnd') {
            statusClass = 'dnd';
            statusName = 'Không làm phiền';
        }

        if (statusDot) statusDot.className = `d-status-dot-badge status-dot ${statusClass}`;
        if (discordStatusRing) discordStatusRing.className = `discord-status-ring ${statusClass}`;
        if (heroStatusIndicator) {
            heroStatusIndicator.className = `online-indicator status-dot ${statusClass}`;
        }

        // Activity details
        if (data.listening_to_spotify && data.spotify) {
            if (actThumbWrap && actThumbImg) {
                actThumbWrap.style.display = 'block';
                actThumbImg.src = data.spotify.album_art_url || '';
            }
            if (statusText) statusText.innerHTML = `<i class="fa-brands fa-spotify" style="color:#1DB954;"></i> ${data.spotify.song}`;
            if (statusSubText) statusSubText.textContent = `${data.spotify.artist} • Nghe trên Spotify`;
        } else if (data.activities && data.activities.length > 0) {
            const gameAct = data.activities.find(a => a.type === 0 || a.type === 1 || a.type === 2 || a.type === 3);
            const customStatusAct = data.activities.find(a => a.type === 4);

            if (gameAct) {
                if (actThumbWrap) actThumbWrap.style.display = 'none';
                const prefix = gameAct.type === 1 ? '🟣 Streaming' : (gameAct.type === 2 ? '🎧 Nghe' : (gameAct.type === 3 ? '📺 Xem' : '🎮 Chơi'));
                if (statusText) statusText.innerHTML = `${prefix} <strong>${gameAct.name}</strong>`;
                if (statusSubText) statusSubText.textContent = gameAct.details || gameAct.state || 'Đang trong trò chơi';
            } else if (customStatusAct) {
                if (actThumbWrap) actThumbWrap.style.display = 'none';
                const emoji = customStatusAct.emoji ? (customStatusAct.emoji.name || '') : '';
                const state = customStatusAct.state || statusName;
                if (statusText) statusText.textContent = `${emoji} ${state}`.trim();
                if (statusSubText) statusSubText.textContent = statusName;
            } else {
                if (actThumbWrap) actThumbWrap.style.display = 'none';
                if (statusText) statusText.textContent = `🌙 ${statusName}`;
                if (statusSubText) statusSubText.textContent = 'Trực tuyến trên Discord';
            }
        } else {
            if (actThumbWrap) actThumbWrap.style.display = 'none';
            if (statusText) statusText.textContent = `🌙 ${statusName}`;
            if (statusSubText) statusSubText.textContent = 'Trực tuyến trên Discord';
        }

    } catch (err) {
        console.warn('Lanyard:', err.message);
        if (statusText) statusText.textContent = '🌙 Ngoại tuyến';
        if (statusSubText) statusSubText.textContent = 'Không có kết nối Discord';
        if (actThumbWrap) actThumbWrap.style.display = 'none';
    }
}

fetchDiscordPresence();
setInterval(fetchDiscordPresence, 15000);

/* Weather Particles (Canvas) */
class VIPWeatherSystem {
    constructor() {
        this.canvas = document.getElementById('weatherCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.currentMode = 'rain';
        this.particles = [];
        this.splashes = [];
        this.animationId = null;

        this.initCanvasSize();
        window.addEventListener('resize', () => this.initCanvasSize());
    }

    initCanvasSize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    setWeather(type) {
        this.currentMode = type;
        this.particles = [];
        this.splashes = [];

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (type === 'off') {
            this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }

        if (type === 'rain') {
            this.initRain(75);
        } else if (type === 'snow') {
            this.initSnow(60);
        }

        this.animate();
    }

    initRain(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            const depth = Math.random();
            this.particles.push({
                x: Math.random() * (this.width + 120) - 60,
                y: Math.random() * this.height,
                length: depth * 16 + 10,
                speed: depth * 4 + 4.5,
                wind: -1.2,
                opacity: depth * 0.35 + 0.15,
                thickness: depth * 0.8 + 0.6
            });
        }
    }

    addSplash(x, y) {
        if (this.splashes.length > 25) return;
        const splashCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < splashCount; i++) {
            const angle = Math.random() * Math.PI + Math.PI;
            const speed = Math.random() * 1.8 + 0.8;
            this.splashes.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 1.2 + 0.4,
                alpha: 0.5,
                life: 1
            });
        }
    }

    renderRain() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const gradient = this.ctx.createLinearGradient(p.x, p.y, p.x + p.wind * 3, p.y + p.length);
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(1, `rgba(210, 235, 255, ${p.opacity})`);

            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.wind * 3, p.y + p.length);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = p.thickness;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            p.x += p.wind;
            p.y += p.speed;

            if (p.y > this.height) {
                if (Math.random() > 0.6) {
                    this.addSplash(p.x, this.height - 2);
                }
                p.y = -p.length;
                p.x = Math.random() * (this.width + 120) - 60;
            }
        }

        for (let i = this.splashes.length - 1; i >= 0; i--) {
            const s = this.splashes[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.08;
            s.life -= 0.04;

            if (s.life <= 0) {
                this.splashes.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(220, 245, 255, ${s.alpha * s.life})`;
            this.ctx.fill();
        }
    }

    initSnow(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            const layer = Math.random();
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: layer * 2.8 + 1.0,
                opacity: layer * 0.5 + 0.25,
                speedY: layer * 0.7 + 0.35,
                swingSpeed: Math.random() * 0.015 + 0.008,
                swingStep: Math.random() * Math.PI * 2,
                glow: layer > 0.6
            });
        }
    }

    renderSnow() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.swingStep += p.swingSpeed;
            const swingOffset = Math.sin(p.swingStep) * 1.8;

            this.ctx.beginPath();
            this.ctx.arc(p.x + swingOffset, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;

            if (p.glow) {
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            p.y += p.speedY;
            p.x += Math.cos(p.swingStep * 0.5) * 0.3;

            if (p.y > this.height + 10) {
                p.y = -10;
                p.x = Math.random() * this.width;
            }
            if (p.x > this.width + 10) p.x = -10;
            if (p.x < -10) p.x = this.width + 10;
        }
    }

    animate() {
        if (this.currentMode === 'rain') {
            this.renderRain();
        } else if (this.currentMode === 'snow') {
            this.renderSnow();
        } else {
            return;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

const weatherSystem = new VIPWeatherSystem();

/* Theme & Weather Preferences */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'green';
    const savedMode = localStorage.getItem('mode') || 'dark';
    const savedWeather = localStorage.getItem('weather') || 'rain';

    document.body.className = `theme-${savedTheme} ${savedMode}-mode`;
    setActiveColor(savedTheme);
    setActiveMode(savedMode);
    setActiveWeather(savedWeather);
    weatherSystem.setWeather(savedWeather);
}

function setActiveColor(theme) {
    colorOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.theme === theme) opt.classList.add('active');
    });
}

function setActiveMode(mode) {
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) btn.classList.add('active');
    });
}

function setActiveWeather(weather) {
    weatherButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.weather === weather) btn.classList.add('active');
    });
}

// Theme Panel Toggle
if (themeToggle && themePanel) {
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        themePanel.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-switcher')) {
            themePanel.classList.remove('show');
        }
    });
}

// Color Selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        const currentMode = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
        document.body.className = `theme-${theme} ${currentMode}`;
        setActiveColor(theme);
        localStorage.setItem('theme', theme);
    });
});

// Mode Selection
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        const currentTheme = Array.from(document.body.classList).find(c => c.startsWith('theme-')) || 'theme-green';
        document.body.className = `${currentTheme} ${mode}-mode`;
        setActiveMode(mode);
        localStorage.setItem('mode', mode);
    });
});

// Weather Selection
weatherButtons.forEach(button => {
    button.addEventListener('click', () => {
        const weather = button.dataset.weather;
        weatherSystem.setWeather(weather);
        setActiveWeather(weather);
        localStorage.setItem('weather', weather);
    });
});

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
});
