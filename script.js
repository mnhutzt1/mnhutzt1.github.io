// Danh sách nhạc
const playlist = [
    { name: 'Song 1', artist: 'Artist 1', file: './music/song1.mp3' },
    { name: 'Song 2', artist: 'Artist 2', file: './music/song2.mp3' }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isMusicUnlocked = false;

// DOM Elements
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.querySelector('.progress-bar');
const autoplayUnlock = document.getElementById('autoplayUnlock');
const unlockMusicBtn = document.getElementById('unlockMusicBtn');
const mainContainer = document.getElementById('mainContainer');
const musicPlayer = document.getElementById('musicPlayer');
const volumeBtn = document.getElementById('volumeBtn');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Theme Switcher Elements
const themeToggle = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
const colorOptions = document.querySelectorAll('.color-option');
const modeButtons = document.querySelectorAll('.mode-btn');

// Ẩn music player ban đầu
musicPlayer.style.display = 'none';

// Load saved theme from localStorage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'green';
    const savedMode = localStorage.getItem('mode') || 'dark';
    
    // Apply saved theme
    document.body.classList.add(`theme-${savedTheme}`, `${savedMode}-mode`);
    setActiveColor(savedTheme);
    setActiveMode(savedMode);
    updateThemeToggleIcon();
}

// Check nếu user đã unlock music trước đó
if (localStorage.getItem('musicUnlocked') === 'true') {
    unlockMusic();
}

// Mở khóa nhạc
unlockMusicBtn.addEventListener('click', unlockMusic);

function unlockMusic() {
    isMusicUnlocked = true;
    localStorage.setItem('musicUnlocked', 'true');
    
    // Ẩn overlay unlock
    autoplayUnlock.classList.add('hidden');
    
    setTimeout(() => {
        autoplayUnlock.style.display = 'none';
        
        // Hiển thị main content và music player
        mainContainer.classList.add('show');
        musicPlayer.style.display = 'block';
        
        // Load và play nhạc
        loadTrack(0);
        audio.volume = volumeSlider.value / 100;
        
        // Thử phát nhạc
        playMusic();
    }, 300);
}

function playMusic() {
    audio.play().then(() => {
        playBtn.textContent = '⏸';
        isPlaying = true;
    }).catch(err => {
        console.log('Không thể phát nhạc tự động:', err);
        playBtn.textContent = '▶';
        isPlaying = false;
    });
}

// Set initial volume
audio.volume = volumeSlider.value / 100;

// Toggle volume control
volumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    volumeControl.classList.toggle('show');
});

// Hide volume control when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#volumeBtn') && !e.target.closest('.volume-control')) {
        volumeControl.classList.remove('show');
    }
});

// Adjust volume
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    // Change icon based on volume
    if (e.target.value == 0) {
        volumeBtn.textContent = '🔇';
    } else if (e.target.value < 50) {
        volumeBtn.textContent = '🔉';
    } else {
        volumeBtn.textContent = '🔊';
    }
});

// Load track
function loadTrack(index) {
    if (playlist[index]) {
        audio.src = playlist[index].file;
        currentTrackIndex = index;
    }
}

// Play/Pause
playBtn.addEventListener('click', () => {
    if (!isMusicUnlocked) {
        alert('Vui lòng mở khóa nhạc trước!');
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
        isPlaying = false;
    } else {
        if (!audio.src) loadTrack(0);
        audio.play().then(() => {
            playBtn.textContent = '⏸';
            isPlaying = true;
        }).catch(err => {
            console.log('Lỗi khi phát:', err);
        });
    }
});

// Next Track
nextBtn.addEventListener('click', () => {
    if (!isMusicUnlocked) return;
    
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(err => {
            console.log('Lỗi khi chuyển bài:', err);
        });
    }
});

// Previous Track
prevBtn.addEventListener('click', () => {
    if (!isMusicUnlocked) return;
    
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(err => {
            console.log('Lỗi khi chuyển bài:', err);
        });
    }
});

// Update progress bar và duration
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

// Load metadata để lấy duration đúng
audio.addEventListener('loadedmetadata', () => {
    if (!isNaN(audio.duration)) {
        durationEl.textContent = formatTime(audio.duration);
    }
});

// Click on progress bar to seek
progressBar.addEventListener('click', (e) => {
    if (!isMusicUnlocked) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (!isNaN(audio.duration)) {
        audio.currentTime = percent * audio.duration;
    }
});

// Auto play next track
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// Format time
function formatTime(time) {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!isMusicUnlocked) {
            autoplayUnlock.classList.remove('hidden');
            return;
        }
        
        // Ẩn các section hiện tại
        document.querySelector('.section.active')?.classList.remove('active');
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        // Hiển thị section mới
        const sectionId = link.getAttribute('data-section');
        const newSection = document.getElementById(sectionId);
        newSection.classList.add('active');
    });
});

// Hiệu ứng hover cho progress bar
progressBar.addEventListener('mouseenter', () => {
    progressFill.style.height = '6px';
});

progressBar.addEventListener('mouseleave', () => {
    progressFill.style.height = '3px';
});

// Theme Switcher Functions
loadSavedTheme();

// Toggle theme panel
themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themePanel.classList.toggle('show');
});

// Hide theme panel when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-switcher')) {
        themePanel.classList.remove('show');
    }
});

// Color theme selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        
        // Remove all theme classes
        document.body.classList.remove('theme-green', 'theme-blue', 'theme-purple', 'theme-red', 'theme-orange', 'theme-pink');
        
        // Add selected theme
        document.body.classList.add(`theme-${theme}`);
        
        // Update active state
        setActiveColor(theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
    });
});

// Dark/Light mode selection
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        
        // Remove both modes
        document.body.classList.remove('dark-mode', 'light-mode');
        
        // Add selected mode
        document.body.classList.add(`${mode}-mode`);
        
        // Update active state
        setActiveMode(mode);
        
        // Save to localStorage
        localStorage.setItem('mode', mode);
        
        // Update icon
        updateThemeToggleIcon();
    });
});

// Helper functions
function setActiveColor(theme) {
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        }
    });
}

function setActiveMode(mode) {
    modeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.mode === mode) {
            button.classList.add('active');
        }
    });
}

function updateThemeToggleIcon() {
    const isLightMode = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLightMode ? '☀️' : '🎨';
}

// Auto hide unlock overlay after 10 seconds if user doesn't interact
setTimeout(() => {
    if (!isMusicUnlocked) {
        unlockMusicBtn.style.animation = 'pulse 1s infinite';
    }
}, 10000);

// Discord status
const discordId = '1066597531951300658';
const discordAvatar = document.getElementById('discordAvatar');
const discordUsername = document.getElementById('discordUsername');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// Set initial status
statusDot.className = 'status-dot offline';
statusText.textContent = 'Đang tải...';

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const body = await response.json();

        if (!response.ok || !body.success || !body.data || !body.data.discord_user) {
            throw new Error('Không có data Discord');
        }

        const user = body.data.discord_user;
        const presence = body.data.discord_status;

        discordUsername.textContent = user.username || 'Người Tình Mùa Đông';
        discordAvatar.src = user.avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${user.avatar}.png` : './images/discord-avatar.png';

        let statusClass = 'offline';
        let statusName = 'Offline';

        if (presence === 'online') {
            statusClass = 'online';
            statusName = 'Online';
        } else if (presence === 'idle') {
            statusClass = 'idle';
            statusName = 'Idle';
        } else if (presence === 'dnd') {
            statusClass = 'dnd';
            statusName = 'Do Not Disturb';
        }

        statusDot.className = `status-dot ${statusClass}`;

        //  tên game/activity 
        let activityName = '';
        if (body.data.activities && body.data.activities.length > 0) {
            const spotify = body.data.activities.find(a => a.name === 'Spotify');
            if (spotify) {
                const artist = spotify.state || '';
                const song = spotify.details || '';
                activityName = ` • Spotify: ${song}${artist ? ` - ${artist}` : ''}`;
            } else {
                const activity = body.data.activities.find(a => a.type === 0 || a.type === 1 || a.type === 3);
                if (activity && activity.name) {
                    activityName = ` • ${activity.name}`;
                    if (activity.details) {
                        activityName += ` (${activity.details})`;
                    }
                }
            }
        }

        statusText.textContent = `Status: ${statusName}${activityName}`;
    } catch (err) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Status: Không lấy được status';
        console.error('Discord status fetch failed:', err);
    }
}

updateDiscordStatus();
setInterval(updateDiscordStatus, 60000);
