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

/* Weather Particles (Canvas)
   - Vẽ bằng sprite dựng sẵn (không tạo gradient / shadowBlur mỗi hạt mỗi khung hình)
   - Chuyển động tính theo thời gian thật => mượt như nhau trên màn 60/120/144Hz */
class VIPWeatherSystem {
    constructor() {
        this.canvas = document.getElementById('weatherCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.currentMode = 'rain';
        this.particles = [];
        this.splashes = [];
        this.sprites = [];
        this.animationId = null;
        this.lastT = 0;
        this.resizeRaf = 0;

        this.initCanvasSize();
        window.addEventListener('resize', () => {
            cancelAnimationFrame(this.resizeRaf);
            this.resizeRaf = requestAnimationFrame(() => this.initCanvasSize());
        });
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
        this.lastT = 0;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (type === 'off') {
            this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }

        if (type === 'rain') {
            this.buildRainSprites();
            this.initRain(75);
        } else if (type === 'snow') {
            this.buildSnowSprites();
            this.initSnow(60);
        }

        this.animate();
    }

    /* ---------- Mưa ---------- */
    buildRainSprites() {
        const N = 6, wind = -1.2, pad = 3;
        this.sprites = [];
        for (let b = 0; b < N; b++) {
            const depth = (b + 0.5) / N;
            const len = depth * 16 + 10, th = depth * 0.8 + 0.6, op = depth * 0.35 + 0.15;
            const dx = wind * 3;
            const w = Math.ceil(Math.abs(dx) + pad * 2 + th), h = Math.ceil(len + pad * 2);
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const g = c.getContext('2d');
            const x0 = dx < 0 ? pad + Math.abs(dx) : pad;
            const grad = g.createLinearGradient(x0, pad, x0 + dx, pad + len);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(1, `rgba(210,235,255,${op})`);
            g.strokeStyle = grad;
            g.lineWidth = th;
            g.lineCap = 'round';
            g.beginPath();
            g.moveTo(x0, pad);
            g.lineTo(x0 + dx, pad + len);
            g.stroke();
            this.sprites.push({ c, ox: x0, oy: pad, len });
        }
    }

    initRain(count) {
        this.particles = [];
        const N = this.sprites.length;
        for (let i = 0; i < count; i++) {
            const depth = Math.random();
            this.particles.push({
                x: Math.random() * (this.width + 120) - 60,
                y: Math.random() * this.height,
                b: Math.min(N - 1, (depth * N) | 0),
                speed: depth * 4 + 4.5,
                wind: -1.2
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

    renderRain(k) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const sp = this.sprites[p.b];
            ctx.drawImage(sp.c, p.x - sp.ox, p.y - sp.oy);

            p.x += p.wind * k;
            p.y += p.speed * k;

            if (p.y > this.height) {
                if (Math.random() > 0.6) this.addSplash(p.x, this.height - 2);
                p.y = -sp.len;
                p.x = Math.random() * (this.width + 120) - 60;
            }
        }

        for (let i = this.splashes.length - 1; i >= 0; i--) {
            const sp = this.splashes[i];
            sp.x += sp.vx * k;
            sp.y += sp.vy * k;
            sp.vy += 0.08 * k;
            sp.life -= 0.04 * k;

            if (sp.life <= 0) {
                this.splashes[i] = this.splashes[this.splashes.length - 1];
                this.splashes.pop();
                continue;
            }

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 245, 255, ${(sp.alpha * sp.life).toFixed(2)})`;
            ctx.fill();
        }
    }

    /* ---------- Tuyết ---------- */
    buildSnowSprites() {
        const N = 6;
        this.sprites = [];
        for (let b = 0; b < N; b++) {
            const layer = (b + 0.5) / N;
            const r = layer * 2.8 + 1.0, op = layer * 0.5 + 0.25, glow = layer > 0.6;
            const pad = glow ? 7 : 1.5;
            const dim = Math.ceil((r + pad) * 2);
            const c = document.createElement('canvas');
            c.width = c.height = dim;
            const g = c.getContext('2d');
            const m = dim / 2;
            const grad = g.createRadialGradient(m, m, 0, m, m, r + pad);
            grad.addColorStop(0, `rgba(255,255,255,${op})`);
            grad.addColorStop(r / (r + pad), `rgba(255,255,255,${op})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            g.fillStyle = grad;
            g.fillRect(0, 0, dim, dim);
            this.sprites.push({ c, m });
        }
    }

    initSnow(count) {
        this.particles = [];
        const N = this.sprites.length;
        for (let i = 0; i < count; i++) {
            const layer = Math.random();
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                b: Math.min(N - 1, (layer * N) | 0),
                speedY: layer * 0.7 + 0.35,
                swingSpeed: Math.random() * 0.015 + 0.008,
                swingStep: Math.random() * Math.PI * 2
            });
        }
    }

    renderSnow(k) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.swingStep += p.swingSpeed * k;
            const sp = this.sprites[p.b];
            ctx.drawImage(sp.c, p.x + Math.sin(p.swingStep) * 1.8 - sp.m, p.y - sp.m);

            p.y += p.speedY * k;
            p.x += Math.cos(p.swingStep * 0.5) * 0.3 * k;

            if (p.y > this.height + 10) {
                p.y = -10;
                p.x = Math.random() * this.width;
            }
            if (p.x > this.width + 10) p.x = -10;
            if (p.x < -10) p.x = this.width + 10;
        }
    }

    animate(now) {
        if (this.currentMode !== 'rain' && this.currentMode !== 'snow') return;
        now = now || performance.now();
        const k = this.lastT ? Math.min(2.5, (now - this.lastT) / 16.667) : 1;
        this.lastT = now;

        if (this.currentMode === 'rain') this.renderRain(k);
        else this.renderSnow(k);

        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
}

const weatherSystem = new VIPWeatherSystem();

/* Tạm dừng / chạy lại mưa-tuyết (dùng khi mở trận đồ để đỡ lag) */
VIPWeatherSystem.prototype.pause = function () {
    if (!this.canvas) return;
    if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
    this.lastT = 0;
};
VIPWeatherSystem.prototype.resume = function () {
    if (!this.canvas) return;
    if ((this.currentMode === 'rain' || this.currentMode === 'snow') && !this.animationId) {
        this.lastT = 0;
        this.animate();
    }
};

/* Video nền: dừng khi mở trận đồ hoặc khi chuyển tab (mỗi khung hình video làm các lớp kính mờ phải vẽ lại) */
const bgVideo = document.getElementById('bgVideo');
function baguaIsOpen() {
    const m = document.getElementById('baguaModal');
    return !!(m && m.classList.contains('active'));
}
document.addEventListener('visibilitychange', () => {
    if (!bgVideo) return;
    if (document.hidden) bgVideo.pause();
    else if (!baguaIsOpen()) bgVideo.play().catch(() => { });
});

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

/* ==========================================================================
   3D Bát Quái Trận Controller (3D Bagua Formation & Floating Glyphs)
   ========================================================================== */
const baguaToggle = document.getElementById('baguaToggle');
const baguaModal = document.getElementById('baguaModal');
const baguaCloseBtn = document.getElementById('baguaCloseBtn');
const baguaBackdrop = document.getElementById('baguaBackdrop');
const baguaStage = document.getElementById('baguaStage');
const baguaFloatingGlyphs = document.getElementById('baguaFloatingGlyphs');

const BAGUA_GLYPH_CHARS = [
    '乾', '坤', '震', '巽', '坎', '離', '艮', '兌',
    '道', '陰', '陽', '仙', '靈', '氣', '神', '玄',
    '妙', '法', '術', '金', '木', '水', '火', '土',
    '虛', '無', '極', '封', '印', '龍', '鳳', '陣'
];


function buildBaguaGlyphs() {
    if (!baguaFloatingGlyphs) return;
    baguaFloatingGlyphs.innerHTML = '';

    const isMobile = window.innerWidth <= 768;
    const orbitCount = isMobile ? 8 : 12;
    const driftCount = isMobile ? 14 : 24;
    const baseRadius = isMobile ? 180 : 310;

    // 1. Wide Orbiting Glyphs (Quỹ đạo vòng cung rộng - Màu trắng đục & trong suốt)
    for (let i = 0; i < orbitCount; i++) {
        const glyph = document.createElement('div');
        glyph.className = 'glyph-orbit';
        glyph.textContent = BAGUA_GLYPH_CHARS[i % BAGUA_GLYPH_CHARS.length];

        const initRot = (360 / orbitCount) * i;
        const rad = baseRadius + (i % 3) * (isMobile ? 25 : 55);
        const z = 10 + (i % 4) * 15;
        const dur = 24 + (i % 4) * 5;
        const del = -(i * 2);
        const sz = (isMobile ? 16 : 22) + (i % 3) * 3;

        const isTranslucent = i % 2 !== 0;
        const col = isTranslucent ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.88)';
        const op = isTranslucent ? 0.45 : 0.85;

        glyph.style.setProperty('--init-rot', `${initRot}deg`);
        glyph.style.setProperty('--rad', `${rad}px`);
        glyph.style.setProperty('--z', `${z}px`);
        glyph.style.setProperty('--dur', `${dur}s`);
        glyph.style.setProperty('--del', `${del}s`);
        glyph.style.setProperty('--sz', `${sz}px`);
        glyph.style.setProperty('--col', col);
        glyph.style.setProperty('--op', op);

        baguaFloatingGlyphs.appendChild(glyph);
    }

    // 2. Full-Screen Cinematic Depth Mist Glyphs (Phân tầng chiều sâu 3D không lag)
    for (let i = 0; i < driftCount; i++) {
        const glyph = document.createElement('div');
        glyph.className = 'glyph-screen-drift';
        glyph.textContent = BAGUA_GLYPH_CHARS[(i + 4) % BAGUA_GLYPH_CHARS.length];

        // Rải đều 100% bề ngang màn hình
        const left = 1 + (i / driftCount) * 98 + (Math.random() - 0.5) * (98 / driftCount);
        const clampedLeft = Math.max(1, Math.min(99, left));
        const driftX = (Math.random() - 0.5) * (isMobile ? 50 : 120);
        const dur = 14 + Math.random() * 12;
        const del = Math.random() * 26;
        const rot = (Math.random() - 0.5) * 30;
        const rotDrift = (Math.random() - 0.5) * 40;

        // Phân 3 tầng chiều sâu điện ảnh (Depth of field)
        const depthTier = i % 3;
        let sz, maxOp, col, z, blur;
        if (depthTier === 0) {
            // Hậu cảnh: nhỏ, mờ ảo xa xôi
            sz = isMobile ? 14 : 17;
            maxOp = 0.28 + Math.random() * 0.15;
            col = 'rgba(255, 255, 255, 0.4)';
            z = -80;
            blur = 'none';
        } else if (depthTier === 1) {
            // Trung cảnh: sắc nét, trắng đục cổ phong
            sz = isMobile ? 18 : 24;
            maxOp = 0.75 + Math.random() * 0.2;
            col = 'rgba(255, 255, 255, 0.9)';
            z = 0;
            blur = 'none';
        } else {
            // Tiền cảnh: lớn, bay lướt gần người xem
            sz = isMobile ? 24 : 34;
            maxOp = 0.5 + Math.random() * 0.25;
            col = 'rgba(255, 255, 255, 0.7)';
            z = 80;
            blur = 'none';
        }

        glyph.style.setProperty('--left', `${clampedLeft.toFixed(1)}%`);
        glyph.style.setProperty('--drift-x', `${driftX.toFixed(1)}px`);
        glyph.style.setProperty('--z', `${z}px`);
        glyph.style.setProperty('--dur', `${dur.toFixed(1)}s`);
        glyph.style.setProperty('--del', `-${del.toFixed(1)}s`);
        glyph.style.setProperty('--rot', `${rot.toFixed(1)}deg`);
        glyph.style.setProperty('--rot-drift', `${rotDrift.toFixed(1)}deg`);
        glyph.style.setProperty('--sz', `${sz}px`);
        glyph.style.setProperty('--max-op', maxOp.toFixed(2));
        glyph.style.setProperty('--col', col);
        glyph.style.setProperty('--blur', blur);

        baguaFloatingGlyphs.appendChild(glyph);
    }
}

function openBaguaModal() {
    if (!baguaModal) return;
    document.documentElement.classList.add('bagua-open');
    if (baguaLite) document.documentElement.classList.add('bagua-lite');
    weatherSystem.pause();
    if (bgVideo) bgVideo.pause();

    baguaModal.classList.add('active');
    baguaModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    buildBaguaGlyphs();
    resetBaguaRingSpin();
    baguaFxStart();
    baguaPerfWatch();

    window.addEventListener('keydown', handleBaguaKeyDown);
}

function closeBaguaModal() {
    if (!baguaModal) return;
    baguaModal.classList.remove('active');
    baguaModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.classList.remove('bagua-open', 'bagua-lite');
    weatherSystem.resume();
    if (bgVideo && !document.hidden) bgVideo.play().catch(() => { });

    cancelAnimationFrame(baguaBurstRaf);
    cancelAnimationFrame(ringSpin.raf);
    ringSpin.raf = null;
    ringSpin.dragging = false;
    ringSpin.charge = 0;
    clearTimeout(baguaBurstTimer);
    clearTimeout(baguaCaptionTimer);
    clearTimeout(baguaCaptionLockTimer);
    baguaCaptionLocked = false;
    baguaFxStop();
    if (baguaStage) {
        baguaStage.classList.remove('is-dragging');
        baguaStage.style.scale = '';
        baguaStage.style.translate = '';
        delete baguaStage.dataset.realm;
        delete baguaStage.dataset.ring;
        baguaStage.style.removeProperty('--qi');
    }
    if (baguaFloatingGlyphs) baguaFloatingGlyphs.innerHTML = '';
    window.removeEventListener('keydown', handleBaguaKeyDown);
}

function handleBaguaKeyDown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        closeBaguaModal();
    }
}

if (baguaToggle) {
    baguaToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (themePanel) themePanel.classList.remove('show');
        if (baguaModal && baguaModal.classList.contains('active')) {
            closeBaguaModal();
        } else {
            openBaguaModal();
        }
    });
}

if (baguaCloseBtn) {
    baguaCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBaguaModal();
    });
}

if (baguaBackdrop) {
    baguaBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBaguaModal();
    });
}

/* ==========================================================================
   Tương tác trận đồ
   - Mỗi vòng là một lò xo có khối lượng: kéo thì vòng bám theo có độ trễ riêng,
     thả ra thì lắc nhẹ rồi ổn định (cảm giác "có lực")
   - Rê chuột khuấy vòng, chạm thì vòng bật lại, thả Thái Cực thì cả trận giật mạnh
   - Mọi ánh sáng tương tác vẽ trên canvas (không dùng CSS filter => không lag)
   ========================================================================== */
const TAU = Math.PI * 2;

// [tên, selector, hệ số theo tay kéo, tần số lò xo ω (rad/s), hệ số tắt dần ζ]
const RING_SPIN_LAYERS = [
    ['frame', '.luopan-layer-frame', 0.30, 6.0, 0.62],
    ['celestial', '.luopan-layer-celestial', 0.60, 7.5, 0.58],
    ['mountains', '.luopan-layer-mountains', 0.90, 9.0, 0.54],
    ['trigrams', '.luopan-layer-trigrams', 1.25, 11.0, 0.50],
    ['tuong', '.luopan-layer-tuong', 1.6, 13.0, 0.46]
];

// Dải bán kính từng vòng (hệ toạ độ SVG 600x600)
const BAGUA_RING_BANDS = {
    tuong: [50, 92],
    trigrams: [98, 140],
    mountains: [150, 202],
    celestial: [210, 277],
    frame: [277, 300]
};

// Ranh giới nhận diện vòng theo bán kính (nằm giữa các khe hở)
const BAGUA_RING_EDGES = [['taiji', 48], ['tuong', 95], ['trigrams', 145], ['mountains', 206], ['celestial', 277]];

/* Tứ Tượng: mỗi cung 90°, quản hai quẻ kề nhau (Thái Dương: Càn-Đoài, Thiếu Âm: Ly-Chấn,
   Thái Âm: Khôn-Cấn, Thiếu Dương: Khảm-Tốn). glyph: Nhật / Thìn / Nguyệt / Tinh theo Thiệu Ung */
const BAGUA_TUONG = [
    { name: 'Thái Dương', han: '太陽', mua: 'Hạ', glyph: '日', rgb: [255, 176, 120] },
    { name: 'Thiếu Âm', han: '少陰', mua: 'Thu', glyph: '辰', rgb: [210, 182, 255] },
    { name: 'Thái Âm', han: '太陰', mua: 'Đông', glyph: '月', rgb: [140, 188, 255] },
    { name: 'Thiếu Dương', han: '少陽', mua: 'Xuân', glyph: '星', rgb: [150, 238, 192] }
];
BAGUA_TUONG.forEach(t => { t.qs = t.rgb.join(','); });
const BAGUA_QUE = [
    { name: 'Càn', han: '乾', el: 'Trời' }, { name: 'Đoài', han: '兌', el: 'Đầm' },
    { name: 'Ly', han: '離', el: 'Lửa' }, { name: 'Chấn', han: '震', el: 'Sấm' },
    { name: 'Khôn', han: '坤', el: 'Đất' }, { name: 'Cấn', han: '艮', el: 'Núi' },
    { name: 'Khảm', han: '坎', el: 'Nước' }, { name: 'Tốn', han: '巽', el: 'Gió' }
];

const BAGUA_RING_NAMES = {
    tuong: 'Tứ Tượng',
    trigrams: 'Bát Quái',
    mountains: 'Nhị Thập Tứ Sơn',
    celestial: 'Chu Thiên',
    frame: ''
};

const ringSpin = {
    angle: 0, vel: 0,              // "tay lái": độ, độ/ms
    dragging: false, charge: 0,
    lastAngle: 0, lastMoveT: 0, lastFrameT: 0, downT: 0, dragTotal: 0,
    hoverAng: null,
    raf: null, rings: [], byName: {}, sweep: null
};

let baguaBurstRaf = null;
let baguaBurstTimer = null;
let baguaBurstRate = 1;
let baguaCaptionTimer = null;
let baguaCaptionLocked = false;
let baguaCaptionLockTimer = null;
let baguaLite = false;

function getBaguaSpinAnims() {
    return baguaStage.getAnimations({ subtree: true }).filter(a =>
        a.animationName && a.animationName.startsWith('luopanSpin'));
}

function resetBaguaRingSpin() {
    ringSpin.angle = 0;
    ringSpin.vel = 0;
    ringSpin.charge = 0;
    ringSpin.dragging = false;
    ringSpin.hoverAng = null;
    baguaBurstRate = 1;
    ringSpin.rings = [];
    ringSpin.byName = {};
    if (baguaStage) {
        for (const [name, sel, k, w, z] of RING_SPIN_LAYERS) {
            const el = baguaStage.querySelector(sel);
            if (!el) continue;
            el.style.rotate = '0deg';
            const ring = { name, el, k, w, z, a: 0, v: 0 };
            ringSpin.rings.push(ring);
            ringSpin.byName[name] = ring;
        }
    }
    // ánh xạ animation CSS -> từng vòng, để biết góc thật (CSS + lò xo) của vòng khi cộng hưởng
    if (baguaStage) {
        for (const an of getBaguaSpinAnims()) {
            const tgt = an.effect && an.effect.target;
            const ring = ringSpin.rings.find(r => r.el === tgt);
            if (!ring) continue;
            const dur = an.effect.getTiming().duration;
            if (typeof dur !== 'number' || !dur) continue;
            ring.spin = { anim: an, dur, dir: /Counter$/.test(an.animationName) ? -1 : 1 };
        }
    }
    ringSpin.sweep = baguaStage ? baguaStage.querySelector('.luopan-sweep') : null;
    if (ringSpin.sweep) { ringSpin.sweep.style.rotate = ''; ringSpin.sweep.style.opacity = ''; }
    setBaguaRing('');
}

/* Đẩy một vòng: ampDeg = biên độ lắc (độ), dấu = chiều đẩy */
function baguaRingKick(name, ampDeg) {
    const ring = ringSpin.byName[name];
    if (!ring || !baguaIsOpen()) return;
    ring.v += ampDeg * ring.w;
    startBaguaRingLoop();
}

function baguaRingLoop(now) {
    const dt = Math.min(0.05, (now - (ringSpin.lastFrameT || now)) / 1000);
    ringSpin.lastFrameT = now;

    if (!ringSpin.dragging) {
        ringSpin.angle += ringSpin.vel * dt * 1000;
        ringSpin.vel *= Math.exp(-dt * 1000 / 650);   // ma sát: giảm dần rất mượt
    }

    let moving = false;
    let maxV = 0;
    const steps = 2, h = dt / steps;
    for (const r of ringSpin.rings) {
        const T = ringSpin.angle * r.k;
        for (let i = 0; i < steps; i++) {
            const acc = r.w * r.w * (T - r.a) - 2 * r.z * r.w * r.v;   // lò xo + tắt dần
            r.v += acc * h;
            r.a += r.v * h;
        }
        if (ringSpin.charge > 0) r.a += (Math.random() - 0.5) * ringSpin.charge * 1.1;   // run khi nạp lực
        const rs = r.a.toFixed(2) + 'deg';
        if (rs !== r.rs) { r.rs = rs; r.el.style.rotate = rs; }
        if (Math.abs(T - r.a) > 0.04 || Math.abs(r.v) > 0.1) moving = true;
        maxV = Math.max(maxV, Math.abs(r.v));
    }

    if (ringSpin.sweep) {
        const speed = Math.min(1, Math.max(Math.abs(ringSpin.vel) / 0.5, maxV / 500));
        const boost = Math.max(speed, ringSpin.charge);
        ringSpin.sweep.style.rotate = ringSpin.angle.toFixed(2) + 'deg';
        ringSpin.sweep.style.opacity = (0.35 + 0.65 * boost).toFixed(3);
    }

    if (ringSpin.dragging || ringSpin.charge > 0 || moving || Math.abs(ringSpin.vel) > 0.004) {
        ringSpin.raf = requestAnimationFrame(baguaRingLoop);
    } else {
        ringSpin.vel = 0;
        ringSpin.raf = null;
        if (ringSpin.sweep) ringSpin.sweep.style.opacity = '';
    }
}

function startBaguaRingLoop() {
    if (ringSpin.raf) return;
    ringSpin.lastFrameT = 0;
    ringSpin.raf = requestAnimationFrame(baguaRingLoop);
}

function baguaPointerAngle(e) {
    return Math.atan2(e.clientY - bfx.cy, e.clientX - bfx.cx) * 180 / Math.PI;
}

/* Góc thật của một vòng (độ, thuận chiều kim đồng hồ): animation CSS + lò xo JS */
function baguaRingAngle(name) {
    const ring = ringSpin.byName[name];
    if (!ring) return 0;
    let a = ring.a;
    const sp = ring.spin;
    if (sp) {
        const t = sp.anim.currentTime;
        if (t != null) a += sp.dir * 360 * ((Number(t) % sp.dur) / sp.dur);
    }
    return a;
}

/* Cung nào của vòng (n cung đều nhau, cung 0 nhận tâm tại 22.5° với Tứ Tượng / 0° với Bát Quái) đang dưới điểm (x, y)? */
function baguaSectorAt(x, y, name, n) {
    const phi = Math.atan2(x - bfx.cx, -(y - bfx.cy)) * 180 / Math.PI;
    const local = (((phi - baguaRingAngle(name)) + 22.5) % 360 + 360) % 360;
    return Math.floor(local / (360 / n)) % n;
}

function baguaPolar(deg, r) {
    const a = (deg - 90) * Math.PI / 180;
    return [bfx.cx + Math.cos(a) * r, bfx.cy + Math.sin(a) * r];
}

/* Con trỏ đang nằm trên vòng nào? (bán kính quy về hệ 600x600 của SVG) */
function baguaRingAt(e) {
    const d = Math.hypot(e.clientX - bfx.cx, e.clientY - bfx.cy) / (bfx.R / 300);
    for (const [n, edge] of BAGUA_RING_EDGES) if (d < edge) return n;
    return 'frame';
}

function setBaguaRing(name) {
    if (!baguaStage) return;
    const caption = document.getElementById('luopanCaption');
    if (baguaStage.dataset.ring === name) return;
    bfx.capKey = '';
    if (caption) { caption.style.color = ''; caption.style.textShadow = ''; }
    if (name) baguaStage.dataset.ring = name; else delete baguaStage.dataset.ring;
    bfx.hoverRing = name && BAGUA_RING_BANDS[name] ? name : '';
    if (bfx.hoverRing) baguaFxWake();
    if (!caption || baguaCaptionLocked) return;
    const text = name === 'taiji' ? 'Thái Cực' : (BAGUA_RING_NAMES[name] || '');
    if (text) {
        caption.textContent = text;
        caption.classList.add('show');
    } else {
        caption.classList.remove('show');
    }
}

function initBaguaDrag() {
    const zone = document.getElementById('luopanDragZone');
    if (!zone || !baguaStage) return;

    zone.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') { bfx.spotOn = true; baguaFxWake(); }
    });

    // Lăn chuột để xoay vòng (có quán tính, lò xo làm mượt)
    zone.addEventListener('wheel', (e) => {
        e.preventDefault();
        const d = Math.max(-120, Math.min(120, e.deltaY));
        ringSpin.angle += d * 0.06;
        ringSpin.vel += d * 0.0004;
        startBaguaRingLoop();
        baguaFxWake();
    }, { passive: false });

    zone.addEventListener('pointerleave', () => {
        bfx.spotOn = false;
        ringSpin.hoverAng = null;
        if (!ringSpin.dragging) setBaguaRing('');
    });

    zone.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        zone.setPointerCapture(e.pointerId);
        ringSpin.dragging = true;
        ringSpin.lastAngle = baguaPointerAngle(e);
        ringSpin.lastMoveT = performance.now();
        ringSpin.downT = ringSpin.lastMoveT;
        ringSpin.dragTotal = 0;
        ringSpin.vel = 0;
        baguaStage.classList.add('is-dragging');
        clearTimeout(baguaCaptionTimer);
        setBaguaRing(baguaRingAt(e));
        if (e.pointerType !== 'mouse') bfx.spotOn = false;
        startBaguaRingLoop();
        baguaFxWake();
    });

    zone.addEventListener('pointermove', (e) => {
        if (!ringSpin.dragging) {
            // Rê chuột: khuấy nhẹ vòng đang đứng dưới con trỏ như khuấy nước
            const name = baguaRingAt(e);
            setBaguaRing(name);
            const a = baguaPointerAngle(e);
            if (ringSpin.hoverAng !== null) {
                let d = a - ringSpin.hoverAng;
                if (d > 180) d -= 360;
                if (d < -180) d += 360;
                const ring = ringSpin.byName[name];
                if (ring && Math.abs(d) < 40) {
                    ring.a += Math.max(-3.5, Math.min(3.5, d * 0.22));
                    startBaguaRingLoop();
                }
            }
            ringSpin.hoverAng = a;
            return;
        }
        const now = performance.now();
        const a = baguaPointerAngle(e);
        let delta = a - ringSpin.lastAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        ringSpin.lastAngle = a;
        ringSpin.angle += delta;
        ringSpin.dragTotal += Math.abs(delta);

        const dt = Math.max(1, now - ringSpin.lastMoveT);
        ringSpin.lastMoveT = now;
        const inst = Math.max(-1.5, Math.min(1.5, delta / dt));
        ringSpin.vel = ringSpin.vel * 0.55 + inst * 0.45;
    });

    const release = (e) => {
        if (!ringSpin.dragging) return;
        ringSpin.dragging = false;
        baguaStage.classList.remove('is-dragging');
        // dừng tay trước khi thả => không văng tiếp
        if (performance.now() - ringSpin.lastMoveT > 90) ringSpin.vel = 0;
        startBaguaRingLoop();
        // chạm nhẹ (không kéo) => vòng bật lại + thi triển pháp thuật tại điểm chạm
        if (e && e.type === 'pointerup' && ringSpin.dragTotal < 5 && performance.now() - ringSpin.downT < 350) {
            baguaFxTap(e.clientX, e.clientY);
        }
        if (e && e.pointerType !== 'mouse') {
            baguaCaptionTimer = setTimeout(() => setBaguaRing(''), 900);
        }
    };
    zone.addEventListener('pointerup', release);
    zone.addEventListener('pointercancel', release);
}

/* ==========================================================================
   Canvas: vệt phù mượt, đèn rọi, dải sáng từng vòng, xoáy hút, nổ phá cảnh
   ========================================================================== */
const BAGUA_REALMS = [
    { name: 'Luyện Khí', seal: '氣', qi: [225, 240, 255] },
    { name: 'Trúc Cơ', seal: '基', qi: [185, 232, 255] },
    { name: 'Kim Đan', seal: '丹', qi: [255, 232, 170] },
    { name: 'Nguyên Anh', seal: '嬰', qi: [255, 210, 140] },
    { name: 'Hóa Thần', seal: '神', qi: [255, 246, 228] }
];
const BAGUA_REALM_AT = [0, 0.2, 0.45, 0.7, 0.95];
const BAGUA_TRIGRAMS = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'];
const BAGUA_QI_DEFAULT = [225, 240, 255];
const BAGUA_RING_ORDER = ['tuong', 'trigrams', 'mountains', 'celestial', 'frame'];
// Mỗi vòng một sắc riêng: Bát Quái vàng kim, 24 Sơn lam ngọc, Chu Thiên tím nhạt, vành ngoài trắng
const BAGUA_RING_RGB = {
    tuong: [255, 196, 170],
    trigrams: [255, 226, 160],
    mountains: [170, 228, 255],
    celestial: [214, 200, 255],
    frame: [235, 242, 255]
};
const BAGUA_REDUCE_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const bfx = {
    tc: null, sc: null, t: null, s: null,
    w: 0, h: 0, dpr: 1, cx: 0, cy: 0, R: 270, frameNo: 0,
    wisps: [], glyphs: [], waves: [], flash: null, flashQ: [],
    raf: null, last: 0, charge: 0, qi: BAGUA_QI_DEFAULT,
    accW: 0, accG: 0, brushUntil: 0,
    ptr: { x: 0, y: 0, t: 0, has: false },
    brush: { has: false, sx: 0, sy: 0, px: 0, py: 0, mx: 0, my: 0, w: 3 },
    spot: { x: 0, y: 0, i: 0 }, spotOn: false,
    hoverRing: '', hoverI: { tuong: 0, trigrams: 0, mountains: 0, celestial: 0, frame: 0 },
    flashI: { tuong: 0, trigrams: 0, mountains: 0, celestial: 0, frame: 0 }, dragI: 0,
    // Tứ Tượng ↔ Bát Quái: độ sáng từng cung / quẻ (rê chuột, nháy khi chạm), tia cộng hưởng, hạt khí chạy dọc tia
    tuI: [0, 0, 0, 0], tuF: [0, 0, 0, 0],
    trI: [0, 0, 0, 0, 0, 0, 0, 0], trF: [0, 0, 0, 0, 0, 0, 0, 0], bmI: [0, 0, 0, 0, 0, 0, 0, 0],
    beads: [], symOn: false, capKey: '',
    tUntil: 0, tDirty: false, sWide: false, centerUntil: 0, recenter: false,
    quality: 1, avgDt: 0.016, lite: false,
    blades: [], impacts: [], sflash: null, realmIdx: -1,
    fm: { vis: 0, ang: 0, parts: [0, 0, 0, 0, 0], shatter: null }
};

const bfxSprites = new Map();

/* Chữ cổ có hào quang được vẽ sẵn 1 lần rồi dùng lại (nhanh hơn shadowBlur mỗi khung hình rất nhiều) */
function baguaGlyphSprite(ch, size, qs) {
    const b = Math.max(12, Math.round(size / 3) * 3);
    qs = qs || bfx.qi.join(',');
    const key = ch + b + qs;
    let sp = bfxSprites.get(key);
    if (sp) return sp;
    if (bfxSprites.size > 360) bfxSprites.clear();
    const pad = Math.ceil(b * 0.55);
    const dim = Math.ceil(b + pad * 2);
    const c = document.createElement('canvas');
    c.width = c.height = Math.ceil(dim * bfx.dpr);
    const g = c.getContext('2d');
    g.scale(bfx.dpr, bfx.dpr);
    g.font = `${b}px "Ma Shan Zheng","STKaiti","KaiTi",serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.shadowColor = `rgba(${qs},0.9)`;
    g.shadowBlur = 10;
    g.fillStyle = '#fff';
    g.fillText(ch, dim / 2, dim / 2);
    sp = { c, dim, b };
    bfxSprites.set(key, sp);
    return sp;
}

function baguaFxStart() {
    if (!baguaModal) return;
    if (!bfx.tc) {
        for (const key of ['tc', 'sc']) {
            const c = document.createElement('canvas');
            c.className = 'bagua-fx';
            c.setAttribute('aria-hidden', 'true');
            baguaModal.appendChild(c);
            bfx[key] = c;
        }
        bfx.t = bfx.tc.getContext('2d');   // lớp có vệt mờ dần (khói / mực / linh khí)
        bfx.s = bfx.sc.getContext('2d');   // lớp nét sắc (ánh sáng, chữ)
    }
    bfx.quality = baguaLite ? 0.55 : 1;
    bfx.lite = baguaLite;
    bfx.avgDt = 0.016;
    baguaFxResize();
    window.addEventListener('resize', baguaFxResizeSoon);
    window.addEventListener('pointermove', baguaBrushMove, { passive: true });
}

function baguaFxStop() {
    cancelAnimationFrame(bfx.raf);
    bfx.raf = null;
    bfx.wisps.length = 0; bfx.glyphs.length = 0; bfx.waves.length = 0; bfx.flashQ.length = 0;
    bfx.flash = null; bfx.charge = 0; bfx.qi = BAGUA_QI_DEFAULT;
    bfx.brush.has = false; bfx.ptr.has = false;
    bfx.blades.length = 0; bfx.impacts.length = 0; bfx.sflash = null; bfx.realmIdx = -1;
    bfx.fm.vis = 0; bfx.fm.parts.fill(0); bfx.fm.shatter = null;
    bfx.spotOn = false; bfx.spot.i = 0; bfx.dragI = 0; bfx.hoverRing = '';
    for (const k of BAGUA_RING_ORDER) { bfx.hoverI[k] = 0; bfx.flashI[k] = 0; }
    for (const arr of [bfx.tuI, bfx.tuF, bfx.trI, bfx.trF, bfx.bmI]) arr.fill(0);
    bfx.beads.length = 0; bfx.symOn = false; bfx.capKey = ''; bfx.tUntil = 0; bfx.tDirty = false;
    bfx.sWide = false; bfx.centerUntil = 0; bfx.recenter = false;
    cancelAnimationFrame(baguaResizeRaf);
    if (bfx.t) { bfx.t.clearRect(0, 0, bfx.w, bfx.h); bfx.s.clearRect(0, 0, bfx.w, bfx.h); }
    window.removeEventListener('resize', baguaFxResizeSoon);
    window.removeEventListener('pointermove', baguaBrushMove);
}

let baguaResizeRaf = 0;
function baguaFxResizeSoon() {
    cancelAnimationFrame(baguaResizeRaf);
    baguaResizeRaf = requestAnimationFrame(baguaFxResize);
}

function baguaFxResize() {
    if (!bfx.tc || !baguaModal) return;
    bfx.w = baguaModal.clientWidth;
    bfx.h = baguaModal.clientHeight;
    // giới hạn tổng số điểm ảnh của canvas: màn lớn không phải vẽ 2 lớp toàn màn hình ở 1.5x
    const budget = bfx.lite ? 1.1e6 : 2.4e6;
    bfx.dpr = Math.max(0.75, Math.min(1.5, window.devicePixelRatio || 1, Math.sqrt(budget / Math.max(1, bfx.w * bfx.h))));
    for (const c of [bfx.tc, bfx.sc]) {
        c.width = Math.round(bfx.w * bfx.dpr);
        c.height = Math.round(bfx.h * bfx.dpr);
    }
    bfx.t.setTransform(bfx.dpr, 0, 0, bfx.dpr, 0, 0);
    bfx.s.setTransform(bfx.dpr, 0, 0, bfx.dpr, 0, 0);
    bfxSprites.clear();
    baguaFxCenter();
}

function baguaFxCenter() {
    if (!baguaStage) return;
    const r = baguaStage.getBoundingClientRect();
    bfx.cx = r.left + r.width / 2;
    bfx.cy = r.top + r.height / 2;
    bfx.R = r.width / 2;
}

function baguaFxWake() {
    if (!bfx.raf && bfx.tc) {
        bfx.last = 0;
        bfx.raf = requestAnimationFrame(baguaFxFrame);
    }
}

/* Con trỏ chỉ ghi lại vị trí; việc vẽ làm trong vòng lặp để mượt và nhẹ */
function baguaBrushMove(e) {
    if (!baguaModal || !baguaModal.classList.contains('active')) return;
    const p = bfx.ptr;
    p.x = e.clientX; p.y = e.clientY; p.t = performance.now(); p.has = true;
    baguaFxWake();
}

function baguaFxSpawnIn(glyph) {
    const m = Math.min(bfx.w, bfx.h);
    const r0 = m * 0.3 + Math.random() * m * 0.24;
    const o = {
        mode: 'in', ang: Math.random() * TAU, r: r0, r0,
        w: 0.7 + Math.random() * 1.1,
        size: glyph ? 15 + Math.random() * 12 : 1.1 + Math.random() * 1.7,
        a0: glyph ? 0.35 + Math.random() * 0.35 : 0.35 + Math.random() * 0.5,
        ch: glyph ? BAGUA_GLYPH_CHARS[(Math.random() * BAGUA_GLYPH_CHARS.length) | 0] : '',
        px: 0, py: 0, first: true
    };
    (glyph ? bfx.glyphs : bfx.wisps).push(o);
}

function baguaFxWave(x, y, opt) {
    bfx.waves.push(Object.assign({
        x, y, maxR: 200, D: 1.1, lw: 3, alpha: 0.8, amp: 0.06,
        seed: Math.random() * 6.28, age: 0, delay: 0
    }, opt));
    baguaFxWake();
}

/* idx (tuỳ chọn): chỉ nháy một cung Tứ Tượng / một quẻ Bát Quái thay vì cả vòng */
function baguaFxFlashRing(name, v, delayMs, idx) {
    if (!(name in bfx.flashI)) return;
    bfx.flashQ.push({ name, v, at: performance.now() + (delayMs || 0), idx });
    baguaFxWake();
}

/* Phá cảnh: kiếm khí tỏa ra, chữ cổ bay tán loạn, sóng khí méo như khói mực */
function baguaFxBurst(level, realm) {
    baguaFxCenter();
    const { cx, cy } = bfx;
    // pháp trận vỡ tung
    const fm = bfx.fm;
    if (realm >= 0) fm.shatter = { age: 0, dur: 0.75, parts: fm.parts.slice(), ang: fm.ang };
    fm.vis = 0;
    fm.parts.fill(0);
    bfx.realmIdx = -1;
    if (realm >= 0) baguaFxBlades(5 + Math.round(level * 7), cx, cy, Math.random() * TAU, 44 + level * 32, null);
    const Q = bfx.quality;
    const big = realm >= 0;
    const nW = Math.round((big ? 90 + 170 * level : 34) * Q);
    for (let i = 0; i < nW; i++) {
        const a = Math.random() * TAU;
        const sp = (big ? 520 + Math.random() * 1150 * (1 + level * 0.5) : 260 + Math.random() * 520);
        bfx.wisps.push({
            mode: 'out', x: cx, y: cy, px: cx, py: cy,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life: 0.8 + Math.random() * 0.8, age: 0, size: 1.3 + Math.random() * 1.7, first: true
        });
    }
    const nG = Math.round((big ? 6 + 16 * level : 3) * Math.max(0.5, Q));
    for (let i = 0; i < nG; i++) {
        const a = Math.random() * TAU;
        const sp = 220 + Math.random() * 520;
        bfx.glyphs.push({
            mode: 'out', x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life: 1.2 + Math.random() * 0.9, age: 0, size: 18 + Math.random() * 16,
            ch: BAGUA_GLYPH_CHARS[(Math.random() * BAGUA_GLYPH_CHARS.length) | 0]
        });
    }
    const nWave = big ? 3 + Math.round(level * 3) : 2;
    for (let i = 0; i < nWave; i++) {
        baguaFxWave(cx, cy, {
            maxR: (big ? 380 : 240) + i * 90 + level * 160, D: 1.0 + i * 0.12 + level * 0.3,
            lw: big ? 5 - i * 0.5 : 3, alpha: 0.9 - i * 0.1, amp: 0.05 + i * 0.012,
            delay: i * 0.11
        });
    }
    bfx.flash = { age: 0, dur: 0.5 + level * 0.3, r: 170 + level * 260 };
    // hai đợt sóng áp lực nối nhau
    bfx.impacts.push({
        x: cx, y: cy, r0: 40, r1: bfx.R * (big ? 2.1 + level * 0.8 : 1.3), w: big ? 46 + level * 30 : 26,
        a: big ? 0.62 : 0.36, dur: big ? 0.5 + level * 0.15 : 0.4, age: 0
    });
    if (big) bfx.impacts.push({
        x: cx, y: cy, r0: 30, r1: bfx.R * (1.6 + level * 0.6), w: 30 + level * 16,
        a: 0.42, dur: 0.45 + level * 0.1, age: -0.1
    });

    // Sóng lực chạy từ tâm ra: từng vòng bùng sáng nối tiếp nhau rồi giật lại
    BAGUA_RING_ORDER.forEach((name, i) => {
        baguaFxFlashRing(name, 1 - i * 0.12, i * (80 - level * 30));
        const dir = i % 2 ? 1 : -1;
        const amp = (big ? 34 + level * 66 : 12) * (0.8 + i * 0.12);
        setTimeout(() => baguaRingKick(name, dir * amp), i * (80 - level * 30));
    });
    // Tứ Tượng bừng sáng lần lượt, rồi sóng khí chạy quanh 8 quẻ
    const cv = big ? 1 : 0.55;
    for (let i = 0; i < 4; i++) baguaFxFlashRing('tuong', cv, 40 + i * 70, i);
    for (let j = 0; j < 8; j++) baguaFxFlashRing('trigrams', cv * 0.95, 120 + j * 42, j);
    bfx.centerUntil = performance.now() + 1600;
    baguaFxWake();
}

/* Chạm vào vòng: vòng bật lại + gợn sóng mực + chữ chú ngữ bay lên */
function baguaFxTap(x, y) {
    if (!bfx.t) return;
    const name = baguaRingAt({ clientX: x, clientY: y });
    const rgb = BAGUA_RING_RGB[name];
    let qs = rgb ? rgb.join(',') : null;
    let tIdx = -1, gIdx = -1;
    let glyphCh = BAGUA_TRIGRAMS[(Math.random() * BAGUA_TRIGRAMS.length) | 0];
    if (name === 'tuong') {
        tIdx = baguaSectorAt(x, y, 'tuong', 4);
        qs = BAGUA_TUONG[tIdx].qs;
        glyphCh = BAGUA_TUONG[tIdx].glyph;
    } else if (name === 'trigrams') {
        gIdx = baguaSectorAt(x, y, 'trigrams', 8);
        tIdx = gIdx >> 1;
        qs = BAGUA_TUONG[tIdx].qs;
        glyphCh = BAGUA_QUE[gIdx].han;
    }
    if (name in bfx.flashI) {
        baguaFxFlashRing(name, tIdx >= 0 ? 0.3 : 1, 0);
        // đẩy ngược chiều lần trước cho tự nhiên
        const ring = ringSpin.byName[name];
        const dir = ring && ring.v > 0 ? -1 : 1;
        baguaRingKick(name, dir * 20);
    }
    baguaFxWave(x, y, { maxR: 150, D: 0.95, lw: 2.6, alpha: 0.8, amp: 0.085, qs });
    baguaFxWave(x, y, { maxR: 95, D: 0.8, lw: 1.8, alpha: 0.6, amp: 0.07, delay: 0.1, qs });
    bfx.glyphs.push({
        mode: 'rise', x, y, vy: -46, vx: (Math.random() - 0.5) * 16,
        life: 1.7, age: 0, size: 34, qs,
        ch: glyphCh
    });
    const n = Math.round(14 * bfx.quality);
    for (let i = 0; i < n; i++) {
        const a = Math.random() * TAU, sp = 90 + Math.random() * 260;
        bfx.wisps.push({
            mode: 'out', x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life: 0.5 + Math.random() * 0.5, age: 0, size: 1.1 + Math.random() * 1.2, first: true, qs
        });
    }
    if (baguaStage && baguaStage.animate) {
        baguaStage.animate([{ scale: 1 }, { scale: 1.024, offset: 0.22 }, { scale: 0.996, offset: 0.55 }, { scale: 1 }],
            { duration: 380, easing: 'ease-out' });
        bfx.impacts.push({ x, y, r0: 10, r1: 140, w: 22, a: 0.3, dur: 0.4, age: 0, qs });
    }
    if (name === 'tuong') {
        // chạm một cung Tứ Tượng: cung bừng sáng, truyền khí sang hai quẻ nó sinh ra
        baguaFxFlashRing('tuong', 1, 0, tIdx);
        baguaFxFlashRing('trigrams', 1, 120, tIdx * 2);
        baguaFxFlashRing('trigrams', 1, 190, tIdx * 2 + 1);
        bfx.beads.push({ j: tIdx * 2, age: 0, dur: 0.5 }, { j: tIdx * 2 + 1, age: -0.07, dur: 0.5 });
        baguaFxTuongCast(tIdx, x, y, qs);
    } else if (name === 'trigrams') {
        baguaFxFlashRing('trigrams', 1, 0, gIdx);
        baguaFxFlashRing('tuong', 0.6, 80, tIdx);
        bfx.beads.push({ j: gIdx, age: 0, dur: 0.45 });
    }
    baguaFxWake();
}

/* Mỗi tượng một "pháp": Thái Dương bùng sáng, Thiếu Âm hút khí về tâm, Thái Âm sương rơi, Thiếu Dương vươn lên */
function baguaFxTuongCast(i, x, y, qs) {
    const Q = bfx.quality;
    const svg = baguaStage && baguaStage.querySelector('.luopan-taiji-svg');
    if (svg && svg.animate) {
        svg.animate([{ scale: 1 }, { scale: 1.1, offset: 0.3 }, { scale: 1 }], { duration: 460, easing: 'ease-out' });
    }
    baguaFxCenter();
    if (i === 0) {
        baguaFxBlades(7, x, y, Math.random() * TAU, 30, qs);
        bfx.impacts.push({ x: bfx.cx, y: bfx.cy, r0: bfx.R * 0.15, r1: bfx.R * 0.66, w: 26, a: 0.4, dur: 0.5, age: 0, qs });
    } else if (i === 1) {
        const n = Math.round(24 * Q);
        for (let k = 0; k < n; k++) {
            const r0 = bfx.R * (0.55 + Math.random() * 0.4);
            bfx.wisps.push({
                mode: 'in', ang: Math.random() * TAU, r: r0, r0, w: 1.4 + Math.random() * 1.4,
                size: 1.2 + Math.random() * 1.6, a0: 0.55 + Math.random() * 0.4, px: 0, py: 0, first: true, qs
            });
        }
    } else if (i === 2) {
        const n = Math.round(26 * Q);
        for (let k = 0; k < n; k++) {
            bfx.wisps.push({
                mode: 'out', x: x + (Math.random() - 0.5) * 150, y: y - 40 + Math.random() * 30, px: 0, py: 0,
                vx: (Math.random() - 0.5) * 50, vy: 70 + Math.random() * 110,
                life: 1.1 + Math.random() * 0.8, age: 0, size: 1 + Math.random() * 1.4, first: true, qs
            });
        }
    } else {
        const n = Math.round(24 * Q);
        for (let k = 0; k < n; k++) {
            bfx.wisps.push({
                mode: 'out', x: x + (Math.random() - 0.5) * 110, y, px: 0, py: 0,
                vx: (Math.random() - 0.5) * 90, vy: -(150 + Math.random() * 230),
                life: 0.9 + Math.random() * 0.7, age: 0, size: 1.2 + Math.random() * 1.5, first: true, qs
            });
        }
        baguaFxBlades(3, x, y, -Math.PI / 2, 24, qs);
    }
}

/* Pháp trận: vòng chính + vạch chia, vòng nét đứt, sao bát giác, 8 chữ bát quái, hai hình vuông chồng.
   Cảnh giới càng cao thì hiện càng nhiều lớp. */
function baguaFxDrawFormation(s, fm, q) {
    const { cx, cy } = bfx;
    const Rf = Math.min(bfx.R * 1.1, Math.min(bfx.w, bfx.h) * 0.4);
    let parts = fm.parts, vis = fm.vis, scale = 1, ang = fm.ang;
    const sh = fm.shatter;
    if (sh) {
        const p = sh.age / sh.dur;
        parts = sh.parts;
        scale = 1 + 0.9 * (1 - Math.pow(1 - p, 3));
        vis = Math.pow(1 - p, 1.3);
        ang = sh.ang + sh.age * 3;
    }
    s.lineCap = 'round';

    let a = parts[0] * vis;
    if (a > 0.01) {                                   // vòng chính + vạch chia
        const r = Rf * scale;
        s.strokeStyle = `rgba(${q},${(0.55 * a).toFixed(3)})`;
        s.lineWidth = 1.4;
        s.beginPath(); s.arc(cx, cy, r, 0, TAU); s.stroke();
        s.lineWidth = 1;
        s.beginPath();
        for (let k = 0; k < 72; k++) {
            const th = ang * 0.5 + (k * TAU) / 72, len = k % 9 === 0 ? 12 : 5;
            const c = Math.cos(th), sn = Math.sin(th);
            s.moveTo(cx + c * (r - len), cy + sn * (r - len));
            s.lineTo(cx + c * r, cy + sn * r);
        }
        s.stroke();
    }

    a = parts[1] * vis;
    if (a > 0.01) {                                   // vòng nét đứt chạy ngược
        s.setLineDash([3, 11]);
        s.lineDashOffset = -ang * 70;
        s.strokeStyle = `rgba(${q},${(0.5 * a).toFixed(3)})`;
        s.lineWidth = 2;
        s.beginPath(); s.arc(cx, cy, Rf * 1.07 * scale, 0, TAU); s.stroke();
        s.setLineDash([]);
    }

    a = parts[2] * vis;
    if (a > 0.01) {                                   // sao bát giác {8/3}
        const r = Rf * 0.96 * scale;
        s.strokeStyle = `rgba(${q},${(0.42 * a).toFixed(3)})`;
        s.lineWidth = 1.2;
        s.beginPath();
        for (let k = 0; k < 8; k++) {
            const t1 = -ang * 0.6 + (k * TAU) / 8, t2 = -ang * 0.6 + (((k + 3) % 8) * TAU) / 8;
            s.moveTo(cx + Math.cos(t1) * r, cy + Math.sin(t1) * r);
            s.lineTo(cx + Math.cos(t2) * r, cy + Math.sin(t2) * r);
        }
        s.stroke();
    }

    a = parts[3] * vis;
    if (a > 0.01) {                                   // 8 chữ bát quái quanh trận
        const r = Rf * 1.18 * scale;
        s.globalAlpha = Math.min(1, a * 0.9);
        for (let k = 0; k < 8; k++) {
            const th = ang * 0.7 + (k * TAU) / 8;
            const sp = baguaGlyphSprite(BAGUA_TRIGRAMS[k], 24, q);
            const d = sp.dim * (24 / sp.b);
            s.drawImage(sp.c, cx + Math.cos(th) * r - d / 2, cy + Math.sin(th) * r - d / 2, d, d);
        }
        s.globalAlpha = 1;
    }

    a = parts[4] * vis;
    if (a > 0.01) {                                   // hai hình vuông chồng + vòng trong
        const r = Rf * 0.82 * scale;
        s.strokeStyle = `rgba(${q},${(0.5 * a).toFixed(3)})`;
        s.lineWidth = 1.4;
        s.beginPath();
        for (let k = 0; k < 8; k++) {
            const t1 = ang * 1.1 + (k * TAU) / 8, t2 = ang * 1.1 + (((k + 2) % 8) * TAU) / 8;
            s.moveTo(cx + Math.cos(t1) * r, cy + Math.sin(t1) * r);
            s.lineTo(cx + Math.cos(t2) * r, cy + Math.sin(t2) * r);
        }
        s.stroke();
        s.lineWidth = 1.8;
        s.beginPath(); s.arc(cx, cy, r * 0.55, 0, TAU); s.stroke();
    }
}

/* Kiếm khí: n lưỡi liềm bay tỏa ra từ (x, y) */
function baguaFxBlades(n, x, y, baseAng, size, qs) {
    const cnt = Math.max(2, Math.round(n * Math.max(0.6, bfx.quality)));
    for (let i = 0; i < cnt; i++) {
        const th = baseAng + (i / cnt) * TAU + (Math.random() - 0.5) * 0.35;
        bfx.blades.push({
            x, y, ux: Math.cos(th), uy: Math.sin(th),
            sp: 900 + Math.random() * 700,
            L: size * (0.7 + Math.random() * 0.6), H: size * (0.55 + Math.random() * 0.4),
            age: 0, life: 0.55 + Math.random() * 0.3, qs: qs || null
        });
    }
    baguaFxWake();
}

/* Thiên lôi: tia sét rẽ nhánh từ trời đánh xuống Thái Cực */
function baguaFxBoltPoints(x1, y1, x2, y2, disp, depth, out) {
    if (depth === 0) { out.push([x2, y2]); return; }
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp * 0.5;
    baguaFxBoltPoints(x1, y1, mx, my, disp * 0.55, depth - 1, out);
    baguaFxBoltPoints(mx, my, x2, y2, disp * 0.55, depth - 1, out);
}

function baguaFxDrawBolt(c, pts, k) {
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.lineJoin = 'round';
    c.lineCap = 'round';
    for (const [w, a, col] of [[11 * k, 0.10, '170,205,255'], [5 * k, 0.30, '200,225,255'], [1.8 * k, 1, '255,255,255']]) {
        c.strokeStyle = `rgba(${col},${a})`;
        c.lineWidth = w;
        c.beginPath();
        pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
        c.stroke();
    }
    c.restore();
}

function baguaFxLightning(level) {
    if (!bfx.t || BAGUA_REDUCE_MOTION) return;
    const n = 3 + Math.round(level * 2);
    for (let i = 0; i < n; i++) {
        setTimeout(() => {
            if (!baguaModal.classList.contains('active')) return;
            baguaFxCenter();
            const x1 = bfx.cx + (Math.random() - 0.5) * 260, y1 = -20;
            const x2 = bfx.cx + (Math.random() - 0.5) * 40, y2 = bfx.cy - 20;
            const pts = [[x1, y1]];
            baguaFxBoltPoints(x1, y1, x2, y2, 160, 6, pts);
            const nb = 1 + Math.round(3 * bfx.quality);
            for (let b = 0; b < nb; b++) {
                const k = 6 + ((Math.random() * (pts.length - 12)) | 0);
                const [bx, by] = pts[k];
                const ang = (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.7) + Math.PI / 2;
                const len = 120 + Math.random() * 180;
                const bp = [[bx, by]];
                baguaFxBoltPoints(bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len * 0.8, 70, 4, bp);
                baguaFxDrawBolt(bfx.t, bp, 0.55);
            }
            baguaFxDrawBolt(bfx.t, pts, 1);
            bfx.tUntil = performance.now() + 1800; bfx.tDirty = true;
            bfx.sflash = { age: 0, dur: 0.28, a: 0.14 + 0.04 * level };
            baguaFxWake();
        }, 120 + i * 95);
    }
}

/* Cung sáng của Tứ Tượng / quẻ Bát Quái, tính theo góc THẬT của vòng đang xoay */
function baguaFxSector(s, name, i, rgb, A) {
    if (A < 0.012) return;
    const [r1, r2] = BAGUA_RING_BANDS[name];
    const sc = bfx.R / 300, cx = bfx.cx, cy = bfx.cy;
    const R1 = r1 * sc, R2 = r2 * sc;
    const isT = name === 'tuong';
    const span = isT ? 90 : 45;
    const mid = baguaRingAngle(name) + (isT ? 22.5 + 90 * i : 45 * i);
    const a0 = (mid - span / 2 - 90) * Math.PI / 180, a1 = (mid + span / 2 - 90) * Math.PI / 180;
    const g = s.createRadialGradient(cx, cy, R1, cx, cy, R2);
    g.addColorStop(0, `rgba(${rgb},${(A * 0.5).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(${rgb},${A.toFixed(3)})`);
    g.addColorStop(1, `rgba(${rgb},${(A * 0.5).toFixed(3)})`);
    s.fillStyle = g;
    s.beginPath();
    s.arc(cx, cy, R2, a0, a1);
    s.arc(cx, cy, R1, a1, a0, true);
    s.closePath();
    s.fill();
    s.strokeStyle = `rgba(${rgb},${Math.min(0.85, A * 1.5).toFixed(3)})`;
    s.lineWidth = 1.3;
    s.beginPath(); s.arc(cx, cy, R2, a0, a1); s.stroke();
    s.beginPath(); s.arc(cx, cy, R1, a0, a1); s.stroke();
}

/* Tia cộng hưởng: đường cong từ mép ngoài cung Tứ Tượng tới mép trong quẻ Bát Quái mà nó sinh ra */
function baguaBeamPts(j) {
    const i = j >> 1, sc = bfx.R / 300;
    const p0 = baguaPolar(baguaRingAngle('tuong') + 22.5 + 90 * i, 92 * sc);
    const p2 = baguaPolar(baguaRingAngle('trigrams') + 45 * j, 98 * sc);
    const mx = (p0[0] + p2[0]) / 2, my = (p0[1] + p2[1]) / 2;
    return [p0, [bfx.cx + (mx - bfx.cx) * 0.45, bfx.cy + (my - bfx.cy) * 0.45], p2];
}

function baguaSymbolCaption(key) {
    const cap = document.getElementById('luopanCaption');
    if (!cap || baguaCaptionLocked) return;
    const n = +key.slice(1);
    const T = key[0] === 't' ? BAGUA_TUONG[n] : BAGUA_TUONG[n >> 1];
    if (key[0] === 't') cap.textContent = `${T.name} ${T.han} · ${T.mua}`;
    else cap.textContent = `${BAGUA_QUE[n].name} ${BAGUA_QUE[n].han} · ${BAGUA_QUE[n].el}`;
    cap.style.color = `rgb(${T.qs})`;
    cap.style.textShadow = `0 0 16px rgba(${T.qs},0.8)`;
    cap.classList.add('show');
}

const baguaTgtT = [0, 0, 0, 0], baguaTgtG = [0, 0, 0, 0, 0, 0, 0, 0], baguaTgtB = [0, 0, 0, 0, 0, 0, 0, 0];

function baguaFxSymbols(s, dt, now) {
    const pt = bfx.ptr;
    const k = 1 - Math.exp(-dt * 10), kf = Math.exp(-dt * 2.8);
    baguaTgtT.fill(0); baguaTgtG.fill(0); baguaTgtB.fill(0);
    let hovT = -1, hovG = -1;

    if (pt.has && bfx.hoverRing === 'tuong') {
        hovT = baguaSectorAt(pt.x, pt.y, 'tuong', 4);
        baguaTgtT[hovT] = 1;
        baguaTgtG[hovT * 2] = baguaTgtG[hovT * 2 + 1] = 0.75;
        baguaTgtB[hovT * 2] = baguaTgtB[hovT * 2 + 1] = 1;
    } else if (pt.has && bfx.hoverRing === 'trigrams') {
        hovG = baguaSectorAt(pt.x, pt.y, 'trigrams', 8);
        baguaTgtG[hovG] = 1;
        baguaTgtT[hovG >> 1] = 0.42;
        baguaTgtB[hovG] = 0.85;
    }
    // tu luyện: mỗi cảnh giới thắp sáng thêm một cung Tứ Tượng cùng hai quẻ của nó
    if (bfx.charge > 0) {
        for (let i = 0; i < 4; i++) {
            if (bfx.realmIdx < i + 1) continue;
            const pulse = 0.55 + 0.2 * Math.sin(now / 180 + i * 1.6);
            baguaTgtT[i] = Math.max(baguaTgtT[i], pulse);
            for (let j = i * 2; j < i * 2 + 2; j++) {
                baguaTgtG[j] = Math.max(baguaTgtG[j], 0.38);
                baguaTgtB[j] = Math.max(baguaTgtB[j], 0.6);
            }
        }
    }

    let on = false;
    for (let i = 0; i < 4; i++) {
        bfx.tuI[i] += (baguaTgtT[i] - bfx.tuI[i]) * k;
        bfx.tuF[i] *= kf;
        if (bfx.tuI[i] > 0.012 || bfx.tuF[i] > 0.012) on = true;
        baguaFxSector(s, 'tuong', i, BAGUA_TUONG[i].qs, Math.min(0.85, 0.42 * bfx.tuI[i] + 0.7 * bfx.tuF[i]));
    }
    for (let j = 0; j < 8; j++) {
        bfx.trI[j] += (baguaTgtG[j] - bfx.trI[j]) * k;
        bfx.bmI[j] += (baguaTgtB[j] - bfx.bmI[j]) * k;
        bfx.trF[j] *= kf;
        if (bfx.trI[j] > 0.012 || bfx.trF[j] > 0.012 || bfx.bmI[j] > 0.012) on = true;
        const qs = BAGUA_TUONG[j >> 1].qs;
        baguaFxSector(s, 'trigrams', j, qs, Math.min(0.85, 0.5 * bfx.trI[j] + 0.7 * bfx.trF[j]));

        const w = Math.max(bfx.bmI[j], bfx.trF[j] * 0.9);
        if (w > 0.02) {
            const [p0, c, p2] = baguaBeamPts(j);
            s.lineCap = 'round';
            s.strokeStyle = `rgba(${qs},${(0.14 * w).toFixed(3)})`;
            s.lineWidth = 6;
            s.beginPath(); s.moveTo(p0[0], p0[1]); s.quadraticCurveTo(c[0], c[1], p2[0], p2[1]); s.stroke();
            s.strokeStyle = `rgba(${qs},${(0.6 * w).toFixed(3)})`;
            s.lineWidth = 1.6;
            s.beginPath(); s.moveTo(p0[0], p0[1]); s.quadraticCurveTo(c[0], c[1], p2[0], p2[1]); s.stroke();
        }
    }

    // hạt khí chạy dọc tia khi chạm / lên cảnh giới
    for (let b = bfx.beads.length - 1; b >= 0; b--) {
        const bd = bfx.beads[b];
        bd.age += dt;
        if (bd.age < 0) continue;
        const p = bd.age / bd.dur;
        if (p >= 1) { bfx.beads[b] = bfx.beads[bfx.beads.length - 1]; bfx.beads.pop(); continue; }
        const e = 1 - Math.pow(1 - p, 2.2), u = 1 - e;
        const [p0, c, p2] = baguaBeamPts(bd.j);
        const x = u * u * p0[0] + 2 * u * e * c[0] + e * e * p2[0];
        const y = u * u * p0[1] + 2 * u * e * c[1] + e * e * p2[1];
        const r = 15 + 8 * Math.sin(p * Math.PI);
        const g = s.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,0.9)');
        g.addColorStop(0.35, `rgba(${BAGUA_TUONG[bd.j >> 1].qs},0.5)`);
        g.addColorStop(1, `rgba(${BAGUA_TUONG[bd.j >> 1].qs},0)`);
        s.fillStyle = g;
        s.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // tên cung / tên quẻ đang đứng dưới con trỏ
    const key = hovT >= 0 ? 't' + hovT : (hovG >= 0 ? 'g' + hovG : '');
    if (key !== bfx.capKey) {
        bfx.capKey = key;
        if (key) baguaSymbolCaption(key);
    }
    return on || bfx.beads.length > 0;
}

function baguaFxFrame(now) {
    const t = bfx.t, s = bfx.s;
    if (!t || !baguaModal.classList.contains('active')) { bfx.raf = null; return; }
    const rawDt = bfx.last ? (now - bfx.last) / 1000 : 0.016;
    const dt = Math.min(0.05, rawDt);
    bfx.last = now;
    // chỉ đo lại toạ độ trận đồ khi nó thực sự đang co / giật (đọc layout mỗi khung hình là tốn)
    if (bfx.charge > 0 || now < bfx.centerUntil) {
        if ((bfx.frameNo++ & 3) === 0) baguaFxCenter();
        bfx.recenter = true;
    } else if (bfx.recenter) {
        baguaFxCenter();
        bfx.recenter = false;
    }

    // tự giảm chất lượng khi máy chậm, tăng lại khi nhẹ nhàng
    bfx.avgDt += (rawDt - bfx.avgDt) * 0.08;
    if (bfx.avgDt > 0.03) bfx.quality = Math.max(0.4, bfx.quality - 0.015);
    else if (bfx.avgDt < 0.021) bfx.quality = Math.min(bfx.lite ? 0.6 : 1, bfx.quality + 0.006);
    const Q = bfx.quality;
    const q = bfx.qi.join(',');
    const { cx, cy, R } = bfx;
    const sc = R / 300;

    // vệt cũ mờ dần như mực loang (độc lập tốc độ khung hình) — chỉ làm mờ khi lớp vệt còn nét vẽ
    if (now < bfx.tUntil) {
        t.globalCompositeOperation = 'destination-out';
        t.fillStyle = `rgba(0,0,0,${(1 - Math.pow(0.92, dt * 60)).toFixed(3)})`;
        t.fillRect(0, 0, bfx.w, bfx.h);
        t.globalCompositeOperation = 'source-over';
    } else if (bfx.tDirty) {
        t.clearRect(0, 0, bfx.w, bfx.h);
        bfx.tDirty = false;
    }
    // lớp nét sắc: nếu khung hình trước chỉ có ánh sáng quanh trận thì chỉ cần xoá vùng trận đồ
    if (bfx.sWide) {
        s.clearRect(0, 0, bfx.w, bfx.h);
    } else {
        const m = bfx.R * 1.25;
        s.clearRect(bfx.cx - m, bfx.cy - m, m * 2, m * 2);
    }
    bfx.sWide = bfx.glyphs.length > 0 || bfx.blades.length > 0 || bfx.impacts.length > 0 ||
        !!bfx.sflash || !!bfx.flash || bfx.charge > 0 || bfx.fm.vis > 0.001 || !!bfx.fm.shatter ||
        (bfx.ptr.has && now - bfx.ptr.t < 110);
    s.globalCompositeOperation = 'lighter';

    // ---------- trạng thái ánh sáng (mượt, độc lập khung hình)
    const kHover = 1 - Math.exp(-dt * 9);
    for (const name of BAGUA_RING_ORDER) {
        bfx.hoverI[name] += ((bfx.hoverRing === name ? 1 : 0) - bfx.hoverI[name]) * kHover;
        bfx.flashI[name] *= Math.exp(-dt * 3.2);
    }
    bfx.dragI += ((ringSpin.dragging ? 1 : 0) - bfx.dragI) * (1 - Math.exp(-dt * 6));
    for (let i = bfx.flashQ.length - 1; i >= 0; i--) {
        const f = bfx.flashQ[i];
        if (now >= f.at) {
            if (f.idx !== undefined && f.name === 'tuong') bfx.tuF[f.idx] = Math.max(bfx.tuF[f.idx], f.v);
            else if (f.idx !== undefined && f.name === 'trigrams') bfx.trF[f.idx] = Math.max(bfx.trF[f.idx], f.v);
            else bfx.flashI[f.name] = Math.max(bfx.flashI[f.name], f.v);
            bfx.flashQ.splice(i, 1);
        }
    }

    // ---------- dải sáng từng vòng
    let bandsOn = false;
    for (const name of BAGUA_RING_ORDER) {
        const bandK = (name === 'tuong' || name === 'trigrams') ? 0.55 : 1;
        const A = Math.min(0.66, bandK * 0.26 * (bfx.hoverI[name] + bfx.dragI * 0.3) + 0.46 * bfx.flashI[name]);
        if (A < 0.012) continue;
        bandsOn = true;
        const [r1, r2] = BAGUA_RING_BANDS[name];
        const R1 = r1 * sc, R2 = r2 * sc;
        const qq = BAGUA_RING_RGB[name].join(',');
        const g = s.createRadialGradient(cx, cy, R1, cx, cy, R2);
        g.addColorStop(0, `rgba(${qq},0)`);
        g.addColorStop(0.5, `rgba(${qq},${A.toFixed(3)})`);
        g.addColorStop(1, `rgba(${qq},0)`);
        s.fillStyle = g;
        s.beginPath();
        s.arc(cx, cy, R2, 0, TAU);
        s.arc(cx, cy, R1, 0, TAU, true);
        s.fill();
        s.strokeStyle = `rgba(${qq},${Math.min(0.7, A * 1.5).toFixed(3)})`;
        s.lineWidth = 1.2;
        s.beginPath(); s.arc(cx, cy, R1, 0, TAU); s.stroke();
        s.beginPath(); s.arc(cx, cy, R2, 0, TAU); s.stroke();
    }

    // ---------- Tứ Tượng ↔ Bát Quái: cung sáng, tia cộng hưởng, hạt khí
    bfx.symOn = baguaFxSymbols(s, dt, now);

    // ---------- đèn rọi bám theo con trỏ (trượt mượt)
    const pt = bfx.ptr, sp = bfx.spot;
    sp.i += ((bfx.spotOn ? 1 : 0) - sp.i) * (1 - Math.exp(-dt * 7));
    if (sp.i > 0.02) {
        const k = 1 - Math.exp(-dt * 14);
        sp.x += (pt.x - sp.x) * k;
        sp.y += (pt.y - sp.y) * k;
        const rad = 150 * (0.92 + 0.28 * bfx.dragI);
        s.save();
        s.beginPath();
        s.arc(cx, cy, R, 0, TAU);
        s.clip();
        const g = s.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, rad);
        g.addColorStop(0, `rgba(255,255,255,${(0.34 * sp.i).toFixed(3)})`);
        g.addColorStop(0.4, `rgba(${q},${(0.12 * sp.i).toFixed(3)})`);
        g.addColorStop(1, `rgba(${q},0)`);
        s.fillStyle = g;
        s.fillRect(sp.x - rad, sp.y - rad, rad * 2, rad * 2);
        s.restore();
    } else {
        sp.x = pt.x; sp.y = pt.y;
    }

    // ---------- vẽ phù: nét bút mượt (đường cong qua các điểm giữa)
    const br = bfx.brush;
    const fresh = pt.has && now - pt.t < 110;
    if (fresh) {
        if (!br.has) {
            br.sx = br.px = br.mx = pt.x;
            br.sy = br.py = br.my = pt.y;
            br.w = 2; br.has = true;
        }
        const k = 1 - Math.exp(-dt * 30);
        const nx = br.sx + (pt.x - br.sx) * k, ny = br.sy + (pt.y - br.sy) * k;
        const dist = Math.hypot(nx - br.sx, ny - br.sy);
        const speed = dist / Math.max(dt, 0.001);
        br.sx = nx; br.sy = ny;
        if (dist > 0.35) {
            const wT = Math.max(1.2, Math.min(7.2, 7.2 - speed * 0.0028));   // nhanh => nét mảnh như bút lông
            br.w += (wT - br.w) * 0.25;
            const mx = (br.px + nx) / 2, my = (br.py + ny) / 2;
            t.lineCap = 'round';
            t.strokeStyle = `rgba(${q},0.09)`;
            t.lineWidth = br.w * 3.4;
            t.beginPath(); t.moveTo(br.mx, br.my); t.quadraticCurveTo(br.px, br.py, mx, my); t.stroke();
            t.strokeStyle = `rgba(${q},0.55)`;
            t.lineWidth = br.w;
            t.beginPath(); t.moveTo(br.mx, br.my); t.quadraticCurveTo(br.px, br.py, mx, my); t.stroke();
            br.px = nx; br.py = ny; br.mx = mx; br.my = my;
            bfx.brushUntil = now + 1700;
            bfx.tUntil = now + 1800; bfx.tDirty = true;
        }
        // đầu bút phát sáng
        const hg = s.createRadialGradient(br.sx, br.sy, 0, br.sx, br.sy, 16);
        hg.addColorStop(0, `rgba(255,255,255,0.55)`);
        hg.addColorStop(1, `rgba(${q},0)`);
        s.fillStyle = hg;
        s.fillRect(br.sx - 16, br.sy - 16, 32, 32);
    } else {
        br.has = false;
    }

    // ---------- hút linh khí về Thái Cực khi đang tu luyện
    if (bfx.charge > 0) {
        bfx.accW += (28 + 240 * bfx.charge) * dt * Q;
        bfx.accG += (4 + 22 * bfx.charge) * dt * Q;
        while (bfx.accW >= 1) { bfx.accW -= 1; if (bfx.wisps.length < 460 * Q) baguaFxSpawnIn(false); }
        while (bfx.accG >= 1) { bfx.accG -= 1; if (bfx.glyphs.length < 90 * Q) baguaFxSpawnIn(true); }
    }
    const ch = bfx.charge;

    // ---------- wisps (lớp vệt mờ)
    if (bfx.wisps.length || bfx.waves.length) { bfx.tUntil = now + 1800; bfx.tDirty = true; }
    t.lineCap = 'round';
    for (let i = bfx.wisps.length - 1; i >= 0; i--) {
        const o = bfx.wisps[i];
        let x, y, a, dead = false;
        if (o.mode === 'in') {
            o.r -= (50 + o.r * 1.25) * dt * (1 + ch * 0.9);
            o.ang += o.w * dt * (1 + ch * 1.1);
            x = cx + Math.cos(o.ang) * o.r;
            y = cy + Math.sin(o.ang) * o.r;
            a = o.a0 * (0.35 + 0.65 * (1 - o.r / o.r0));
            dead = o.r < 34 || (bfx.charge === 0 && o.r < 60);
        } else {
            o.age += dt;
            const damp = Math.exp(-2.3 * dt);
            o.vx *= damp; o.vy *= damp;
            x = o.x + o.vx * dt; y = o.y + o.vy * dt;
            o.x = x; o.y = y;
            a = Math.pow(Math.max(0, 1 - o.age / o.life), 1.3) * 0.95;
            dead = o.age >= o.life;
        }
        if (!o.first) {
            t.strokeStyle = `rgba(${o.qs || q},${a.toFixed(3)})`;
            t.lineWidth = o.size;
            t.beginPath(); t.moveTo(o.px, o.py); t.lineTo(x, y); t.stroke();
        }
        o.px = x; o.py = y; o.first = false;
        if (dead) { bfx.wisps[i] = bfx.wisps[bfx.wisps.length - 1]; bfx.wisps.pop(); }
    }

    // ---------- sóng khí méo như khói mực
    const N = Math.round(72 * Math.max(0.5, Q));
    for (let i = bfx.waves.length - 1; i >= 0; i--) {
        const w = bfx.waves[i];
        if (w.delay > 0) { w.delay -= dt; continue; }
        w.age += dt;
        const p = Math.min(1, w.age / w.D);
        if (p >= 1) { bfx.waves[i] = bfx.waves[bfx.waves.length - 1]; bfx.waves.pop(); continue; }
        const r = w.maxR * (1 - Math.pow(1 - p, 3));
        t.strokeStyle = `rgba(${w.qs || q},${(w.alpha * Math.pow(1 - p, 1.4)).toFixed(3)})`;
        t.lineWidth = w.lw * (1 - p) + 0.6;
        t.beginPath();
        for (let k = 0; k <= N; k++) {
            const th = (k / N) * TAU;
            const n = Math.sin(th * 3 + w.seed + w.age * 2.2) * 0.55
                + Math.sin(th * 5 - w.seed * 1.7 + w.age * 3.1) * 0.3
                + Math.sin(th * 9 + w.seed * 2.3 - w.age * 4) * 0.15;
            const rr = r * (1 + w.amp * n * (0.4 + 0.6 * p));
            const px = w.x + Math.cos(th) * rr, py = w.y + Math.sin(th) * rr;
            if (k === 0) t.moveTo(px, py); else t.lineTo(px, py);
        }
        t.stroke();
    }

    // ---------- chữ cổ (sprite có sẵn hào quang)
    for (let i = bfx.glyphs.length - 1; i >= 0; i--) {
        const g = bfx.glyphs[i];
        let x, y, a, size = g.size, dead = false;
        if (g.mode === 'in') {
            g.r -= (50 + g.r * 1.25) * dt * (1 + ch * 0.9);
            g.ang += g.w * dt * (1 + ch * 1.1);
            x = cx + Math.cos(g.ang) * g.r;
            y = cy + Math.sin(g.ang) * g.r;
            const near = g.r / g.r0;
            a = g.a0 * (0.3 + 0.7 * (1 - near)) * Math.min(1, g.r / 70);
            size = g.size * (0.55 + 0.45 * near);
            dead = g.r < 40 || (bfx.charge === 0 && g.r < 80);
        } else if (g.mode === 'rise') {
            g.age += dt;
            g.vy *= Math.exp(-0.5 * dt);
            g.x += g.vx * dt; g.y += g.vy * dt;
            x = g.x; y = g.y;
            a = Math.min(1, g.age / 0.15) * Math.max(0, 1 - g.age / g.life) * 0.92;
            dead = g.age >= g.life;
        } else {
            g.age += dt;
            const damp = Math.exp(-1.8 * dt);
            g.vx *= damp; g.vy *= damp;
            g.x += g.vx * dt; g.y += g.vy * dt;
            x = g.x; y = g.y;
            a = Math.max(0, 1 - g.age / g.life) * 0.85;
            dead = g.age >= g.life;
        }
        if (a > 0.01) {
            const sprite = baguaGlyphSprite(g.ch, size, g.qs);
            const d = sprite.dim * (size / sprite.b);
            s.globalAlpha = Math.min(1, a);
            s.drawImage(sprite.c, x - d / 2, y - d / 2, d, d);
        }
        if (dead) { bfx.glyphs[i] = bfx.glyphs[bfx.glyphs.length - 1]; bfx.glyphs.pop(); }
    }
    s.globalAlpha = 1;

    // ---------- pháp trận: hiện dần quanh Thái Cực khi tu luyện, vỡ tung khi phá cảnh
    const fm = bfx.fm;
    const kf = 1 - Math.exp(-dt * 6);
    fm.vis += ((bfx.charge > 0 ? 1 : 0) - fm.vis) * (1 - Math.exp(-dt * 5));
    fm.ang += dt * (0.22 + 1.5 * bfx.charge);
    for (let i = 0; i < 5; i++) {
        fm.parts[i] += (((bfx.charge > 0 && i <= bfx.realmIdx) ? 1 : 0) - fm.parts[i]) * kf;
    }
    if (fm.shatter) {
        fm.shatter.age += dt;
        if (fm.shatter.age >= fm.shatter.dur) fm.shatter = null;
    }
    if (fm.vis > 0.02 || fm.shatter) baguaFxDrawFormation(s, fm, q);

    // ---------- kiếm khí: lưỡi liềm sáng bay vút ra
    for (let i = bfx.blades.length - 1; i >= 0; i--) {
        const b = bfx.blades[i];
        b.age += dt;
        const p = b.age / b.life;
        if (p >= 1) { bfx.blades[i] = bfx.blades[bfx.blades.length - 1]; bfx.blades.pop(); continue; }
        b.sp *= Math.exp(-1.7 * dt);
        b.x += b.ux * b.sp * dt;
        b.y += b.uy * b.sp * dt;
        const L = b.L * (1 + p * 0.7), H = b.H * (1 - p * 0.3);
        const nx = -b.uy, ny = b.ux;
        const a = Math.pow(1 - p, 1.2) * 0.62;
        s.fillStyle = `rgba(${b.qs || q},${a.toFixed(3)})`;
        s.beginPath();
        s.moveTo(b.x - nx * L, b.y - ny * L);
        s.quadraticCurveTo(b.x + b.ux * H * 2, b.y + b.uy * H * 2, b.x + nx * L, b.y + ny * L);
        s.quadraticCurveTo(b.x + b.ux * H * 1.35, b.y + b.uy * H * 1.35, b.x - nx * L, b.y - ny * L);
        s.fill();
    }

    // ---------- sóng áp lực: vành sáng dày lao ra như một cú đấm
    for (let i = bfx.impacts.length - 1; i >= 0; i--) {
        const m = bfx.impacts[i];
        m.age += dt;
        if (m.age < 0) continue;
        const p = m.age / m.dur;
        if (p >= 1) { bfx.impacts[i] = bfx.impacts[bfx.impacts.length - 1]; bfx.impacts.pop(); continue; }
        const e = 1 - Math.pow(1 - p, 3);
        const r = m.r0 + (m.r1 - m.r0) * e;
        const w = m.w * (1 - p) + 6;
        const A = m.a * Math.pow(1 - p, 1.4);
        const mq = m.qs || q;
        const g = s.createRadialGradient(m.x, m.y, Math.max(0, r - w), m.x, m.y, r + w);
        g.addColorStop(0, `rgba(${mq},0)`);
        g.addColorStop(0.62, `rgba(${mq},${(A * 0.5).toFixed(3)})`);
        g.addColorStop(0.8, `rgba(255,255,255,${A.toFixed(3)})`);
        g.addColorStop(1, `rgba(${mq},0)`);
        s.fillStyle = g;
        s.beginPath();
        s.arc(m.x, m.y, r + w, 0, TAU);
        s.fill();
    }

    // ---------- chớp trời khi thiên lôi giáng
    if (bfx.sflash) {
        const f = bfx.sflash;
        f.age += dt;
        const p = f.age / f.dur;
        if (p >= 1) {
            bfx.sflash = null;
        } else {
            s.fillStyle = `rgba(215,230,255,${(f.a * Math.pow(1 - p, 2)).toFixed(3)})`;
            s.fillRect(0, 0, bfx.w, bfx.h);
        }
    }

    // ---------- chớp sáng từ tâm
    if (bfx.flash) {
        const f = bfx.flash;
        f.age += dt;
        const p = f.age / f.dur;
        if (p >= 1) {
            bfx.flash = null;
        } else {
            const grd = s.createRadialGradient(cx, cy, 0, cx, cy, f.r);
            const a = Math.pow(1 - p, 2) * 0.85;
            grd.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`);
            grd.addColorStop(0.35, `rgba(${q},${(a * 0.4).toFixed(3)})`);
            grd.addColorStop(1, `rgba(${q},0)`);
            s.fillStyle = grd;
            s.fillRect(cx - f.r, cy - f.r, f.r * 2, f.r * 2);
        }
    }
    s.globalCompositeOperation = 'source-over';

    const alive = bfx.wisps.length || bfx.glyphs.length || bfx.waves.length || bfx.flash ||
        bfx.charge > 0 || now < bfx.tUntil || bfx.symOn || br.has || fresh ||
        bfx.spotOn || sp.i > 0.02 || bandsOn || bfx.flashQ.length || ringSpin.dragging ||
        bfx.blades.length || bfx.impacts.length || bfx.sflash || bfx.fm.vis > 0.02 || bfx.fm.shatter;
    if (alive) {
        bfx.raf = requestAnimationFrame(baguaFxFrame);
    } else {
        bfx.raf = null;
        t.clearRect(0, 0, bfx.w, bfx.h);
        s.clearRect(0, 0, bfx.w, bfx.h);
    }
}

/* Tự phát hiện máy yếu: nếu khung hình chậm thì bật chế độ nhẹ (bỏ kính mờ, bớt chi tiết) */
function baguaPerfWatch() {
    if (baguaLite) return;
    const samples = [];
    let last = 0;
    const t0 = performance.now();
    function tick(now) {
        if (!baguaModal.classList.contains('active')) return;
        if (last && now - t0 > 900) samples.push(now - last);
        last = now;
        if (now - t0 < 2800) {
            requestAnimationFrame(tick);
        } else if (samples.length > 8) {
            samples.sort((a, b) => a - b);
            if (samples[samples.length >> 1] > 26) {
                baguaLite = true;
                bfx.lite = true;
                bfx.quality = Math.min(bfx.quality, 0.6);
                document.documentElement.classList.add('bagua-lite');
                baguaFxResize();
            }
        }
    }
    requestAnimationFrame(tick);
}

/* ==========================================================================
   Phá cảnh: thả Thái Cực sau khi tu luyện
   level (0..1): mức nạp; realm: cảnh giới đạt được (-1 nếu chỉ chạm nhanh)
   ========================================================================== */
function baguaSetCaption(text, pop) {
    const caption = document.getElementById('luopanCaption');
    if (!caption) return;
    caption.textContent = text;
    caption.classList.add('show');
    if (pop && caption.animate) {
        caption.animate([{ scale: 1.35, opacity: 0.6 }, { scale: 1, opacity: 1 }],
            { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
}

function baguaLockCaption(ms) {
    baguaCaptionLocked = true;
    clearTimeout(baguaCaptionLockTimer);
    if (ms) {
        baguaCaptionLockTimer = setTimeout(() => {
            baguaCaptionLocked = false;
            if (baguaStage) {
                const caption = document.getElementById('luopanCaption');
                if (caption) caption.classList.remove('show');
                delete baguaStage.dataset.ring;
                delete baguaStage.dataset.realm;
                baguaStage.style.removeProperty('--qi');
            }
            bfx.qi = BAGUA_QI_DEFAULT;
        }, ms);
    }
}

function triggerBaguaBurst(level = 0, realm = -1, fromScale = 1) {
    if (!baguaStage) return;
    baguaStage.style.scale = '';
    baguaStage.style.translate = '';
    const svg = baguaStage.querySelector('.luopan-taiji-svg');
    const seal = document.getElementById('luopanSeal');
    const big = realm >= 0;

    baguaFxBurst(level, realm);
    if (realm >= 3) baguaFxLightning(level);

    // Thái Cực "nén rồi bật" (Web Animations để không làm đứt vòng quay của nó)
    if (svg && svg.animate) {
        svg.animate(
            [{ scale: 1 }, { scale: 0.86 - level * 0.06, offset: 0.22 }, { scale: 1.16 + level * 0.1, offset: 0.5 }, { scale: 1 }],
            { duration: 850, easing: 'cubic-bezier(0.22, 0.9, 0.3, 1)' }
        );
    }

    // Cả trận đồ giật mạnh (phóng nhẹ + rung) rồi tắt dần
    if (baguaStage.animate) {
        const amp = 4 + level * 14;
        const pop = big ? 1 + 0.032 + level * 0.06 : 1.016;
        baguaStage.animate([
            { translate: '0 0', scale: fromScale },
            { translate: `${(-amp).toFixed(1)}px ${(amp * 0.5).toFixed(1)}px`, scale: pop, offset: 0.12 },
            { translate: `${(amp * 0.8).toFixed(1)}px ${(-amp * 0.6).toFixed(1)}px`, scale: 1 + (pop - 1) * 0.4, offset: 0.3 },
            { translate: `${(-amp * 0.45).toFixed(1)}px ${(amp * 0.3).toFixed(1)}px`, scale: 1, offset: 0.52 },
            { translate: `${(amp * 0.2).toFixed(1)}px ${(-amp * 0.1).toFixed(1)}px`, scale: 1, offset: 0.76 },
            { translate: '0 0', scale: 1 }
        ], { duration: 600 + level * 360, easing: 'ease-out' });
    }

    // Đóng ấn chữ cổ + hiện tên cảnh giới
    if (big) {
        const R = BAGUA_REALMS[realm];
        if (seal && seal.animate) {
            seal.textContent = R.seal;
            seal.animate([
                { opacity: 0, scale: 1.8, filter: 'blur(20px)' },
                { opacity: 0.9, scale: 1, filter: 'blur(0px)', offset: 0.16 },
                { opacity: 0.85, scale: 1.03, filter: 'blur(0px)', offset: 0.55 },
                { opacity: 0, scale: 1.1, filter: 'blur(10px)' }
            ], { duration: 2000, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
        }
        baguaSetCaption('Phá Cảnh · ' + R.name, true);
        baguaLockCaption(1900);
    } else {
        baguaCaptionLocked = false;
    }

    // Tốc độ quay: vọt lên nhanh (ease-out) rồi thả dần về 1x (ease-out mũ 3)
    const anims = getBaguaSpinAnims();
    if (!anims.length) return;

    cancelAnimationFrame(baguaBurstRaf);
    const PEAK = 10 + level * 11, ATTACK = 240, DECAY = 2800 + level * 1400;
    const from = baguaBurstRate;
    const t0 = performance.now();
    function step(now) {
        const t = Math.max(0, now - t0);
        let rate;
        if (t < ATTACK) {
            const p = t / ATTACK;
            rate = from + (PEAK - from) * (1 - Math.pow(1 - p, 3));
        } else {
            const p = Math.min(1, (t - ATTACK) / DECAY);
            rate = 1 + (PEAK - 1) * Math.pow(1 - p, 3);
        }
        baguaBurstRate = rate;
        anims.forEach(a => { try { a.updatePlaybackRate(rate); } catch (_) { } });
        if (t < ATTACK + DECAY) {
            baguaBurstRaf = requestAnimationFrame(step);
        } else {
            baguaBurstRate = 1;
            anims.forEach(a => { try { a.updatePlaybackRate(1); } catch (_) { } });
        }
    }
    baguaBurstRaf = requestAnimationFrame(step);
}

/* Giữ Thái Cực để tu luyện: Luyện Khí → Trúc Cơ → Kim Đan → Nguyên Anh → Hóa Thần */
function initBaguaCharge() {
    const billboard = baguaStage && baguaStage.querySelector('.luopan-taiji-billboard');
    const hit = billboard && billboard.querySelector('.luopan-taiji-hit');
    if (!billboard || !hit) return;
    const chargeEl = billboard.querySelector('.luopan-charge');
    const svgEl = billboard.querySelector('.luopan-taiji-svg');

    const ch = { active: false, t0: 0, level: 0, raf: null, anims: [], realm: -1 };
    const CHARGE_MS = 1600;

    function onRealmUp(idx) {
        const R = BAGUA_REALMS[idx];
        bfx.qi = R.qi;
        bfx.realmIdx = idx;
        baguaStage.style.setProperty('--qi', R.qi.join(','));
        baguaStage.dataset.realm = idx;
        baguaLockCaption(0);
        baguaSetCaption(R.name, true);
        if (idx > 0) {
            baguaFxCenter();
            baguaFxWave(bfx.cx, bfx.cy, { maxR: 220 + idx * 30, D: 0.9, lw: 3, alpha: 0.8, amp: 0.05 });
            baguaFxBlades(3, bfx.cx, bfx.cy, Math.random() * TAU, 30 + idx * 5, null);
            // lên cảnh giới: thắp một cung Tứ Tượng, truyền khí sang hai quẻ của nó
            if (idx <= 4) {
                const ti = idx - 1;
                baguaFxFlashRing('tuong', 1, 0, ti);
                baguaFxFlashRing('trigrams', 0.85, 90, ti * 2);
                baguaFxFlashRing('trigrams', 0.85, 150, ti * 2 + 1);
                bfx.beads.push({ j: ti * 2, age: 0, dur: 0.5 }, { j: ti * 2 + 1, age: -0.06, dur: 0.5 });
            }
            // mỗi lần lên cảnh, các vòng giật nhẹ một cái
            BAGUA_RING_ORDER.forEach((name, i) => {
                baguaFxFlashRing(name, 0.55, i * 60);
                baguaRingKick(name, (i % 2 ? 1 : -1) * (5 + idx * 2));
            });
        }
    }

    function chargeStep() {
        if (!ch.active) return;
        const held = performance.now() - ch.t0;
        const p = Math.min(1, held / CHARGE_MS);
        ch.level = p * p * (3 - 2 * p);                // smoothstep
        ringSpin.charge = ch.level;
        bfx.charge = ch.level;

        // chỉ đụng vào opacity/scale (không đổi biến CSS => không tính lại style cả cây)
        if (chargeEl) {
            chargeEl.style.opacity = (ch.level * 0.95).toFixed(3);
            chargeEl.style.scale = (0.5 + ch.level * 0.95).toFixed(3);
        }
        if (svgEl) svgEl.style.scale = (1 - ch.level * 0.12).toFixed(3);
        // cả trận đồ bị nén lại như đang dồn lực, càng đầy càng run
        baguaStage.style.scale = (1 - ch.level * 0.035).toFixed(4);
        const sj = Math.max(0, ch.level - 0.45) * 5;
        baguaStage.style.translate = sj > 0 ? `${((Math.random() - 0.5) * sj).toFixed(2)}px ${((Math.random() - 0.5) * sj).toFixed(2)}px` : '';

        let idx = -1;
        if (held >= 220) {
            idx = 0;
            for (let i = 1; i < BAGUA_REALM_AT.length; i++) if (ch.level >= BAGUA_REALM_AT[i]) idx = i;
        }
        if (idx !== ch.realm) { ch.realm = idx; if (idx >= 0) onRealmUp(idx); }

        // rung lắc tăng dần khi gần đầy
        const j = Math.max(0, ch.level - 0.35) * 4.2;
        billboard.style.translate = `${((Math.random() - 0.5) * j).toFixed(2)}px ${((Math.random() - 0.5) * j).toFixed(2)}px`;

        baguaBurstRate = 1 + 6 * ch.level;
        ch.anims.forEach(a => { try { a.updatePlaybackRate(baguaBurstRate); } catch (_) { } });
        startBaguaRingLoop();
        baguaFxWake();
        ch.raf = requestAnimationFrame(chargeStep);
    }

    function endCharge(fire) {
        if (!ch.active) return;
        ch.active = false;
        cancelAnimationFrame(ch.raf);
        const held = performance.now() - ch.t0;
        const quick = held < 220;
        const level = quick ? 0 : ch.level;
        const realm = quick ? -1 : Math.max(0, ch.realm);
        billboard.classList.remove('is-charging');
        billboard.style.translate = '';
        if (chargeEl) { chargeEl.style.opacity = ''; chargeEl.style.scale = ''; }
        if (svgEl) svgEl.style.scale = '';
        const fromScale = parseFloat(baguaStage.style.scale) || 1;

        const release = () => {
            ringSpin.charge = 0;
            bfx.charge = 0;
            if (fire && baguaModal.classList.contains('active')) triggerBaguaBurst(level, realm, fromScale);
        };

        // "Khựng" một nhịp trước khi nổ: mọi thứ đóng băng ngắn rồi bùng ra (cảm giác lực đánh)
        const hold = (fire && realm >= 2) ? 45 + level * 55 : 0;
        if (hold) {
            ch.anims.forEach(a => { try { a.updatePlaybackRate(0.03); } catch (_) { } });
            baguaBurstRate = 0.03;
            clearTimeout(ch.holdTimer);
            ch.holdTimer = setTimeout(release, hold);
        } else {
            release();
        }
    }

    hit.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        e.stopPropagation();
        hit.setPointerCapture(e.pointerId);
        cancelAnimationFrame(baguaBurstRaf);
        clearTimeout(ch.holdTimer);
        clearTimeout(baguaCaptionLockTimer);
        baguaCaptionLocked = false;
        baguaFxCenter();
        ch.anims = getBaguaSpinAnims();
        ch.active = true;
        ch.t0 = performance.now();
        ch.level = 0;
        ch.realm = -1;
        billboard.classList.add('is-charging');
        ch.raf = requestAnimationFrame(chargeStep);
    });

    hit.addEventListener('pointerup', () => endCharge(true));
    hit.addEventListener('pointercancel', () => endCharge(true));
    hit.addEventListener('contextmenu', (e) => e.preventDefault());

    hit.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') { setBaguaRing('taiji'); bfx.spotOn = false; }
    });
    hit.addEventListener('pointerleave', () => {
        if (!ch.active) setBaguaRing('');
    });
}

if (baguaStage) {
    initBaguaDrag();
    initBaguaCharge();
}
