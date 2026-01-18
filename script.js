// Danh sách nhạc (thêm file nhạc vào folder music/)
const playlist = [
    { name: 'Song 1', artist: 'Artist 1', file: './music/song1.mp3' },
];

let currentTrackIndex = 0;
let isPlaying = false;
let isMusicUnlocked = false;

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

// Volume control
const volumeBtn = document.getElementById('volumeBtn');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');

// Ẩn music player ban đầu
musicPlayer.style.display = 'none';

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

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

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
            alert('Không thể phát nhạc. Vui lòng kiểm tra file nhạc!');
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

// Handle audio errors
audio.addEventListener('error', (e) => {
    console.error('Lỗi audio:', e);
    alert('Không thể load file nhạc. Vui lòng kiểm tra file nhạc trong thư mục music/');
});

// Format time
function formatTime(time) {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Show container when clicking a nav link
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

// Auto hide unlock overlay after 10 seconds if user doesn't interact
setTimeout(() => {
    if (!isMusicUnlocked) {
        unlockMusicBtn.style.animation = 'pulse 1s infinite';
    }
}, 10000);

// Hiệu ứng hover cho progress bar
progressBar.addEventListener('mouseenter', () => {
    progressFill.style.height = '6px';
});

progressBar.addEventListener('mouseleave', () => {
    progressFill.style.height = '3px';
});