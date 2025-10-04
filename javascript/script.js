// Modern JavaScript for Dick Harper is a Tool website
class GlobodyneTracker {
    constructor() {
        this.startDate = new Date("2000-12-01");
        this.dateElement = document.getElementById("date");
        this.video = document.getElementById("main-video");
        this.playPauseBtn = document.getElementById("play-pause-btn");
        this.muteBtn = document.getElementById("mute-btn");
        this.fullscreenBtn = document.getElementById("fullscreen-btn");
        this.videoControls = document.getElementById("video-controls");
        this.soundNotification = document.getElementById("sound-notification");
        this.enableSoundBtn = document.getElementById("enable-sound-btn");

        this.init();
    }

    init() {
        this.updateDayCounter();
        this.setupSoundNotification();
        this.setupVideoControls();

        // Update every minute instead of every 100ms for better performance
        setInterval(() => this.updateDayCounter(), 60000);
    }

    updateDayCounter() {
        const currentTime = Date.now();
        const timeDifference = currentTime - this.startDate.getTime();
        const daysSince = timeDifference / (1000 * 3600 * 24);


        if (this.dateElement) {
            this.dateElement.textContent = daysSince.toFixed(2);
        }
    }

    setupSoundNotification() {
        if (!this.enableSoundBtn || !this.soundNotification || !this.video) return;

        // Show notification for 8 seconds, then auto-hide
        // const autoHideTimeout = setTimeout(() => {
        //     this.hideSoundNotification();
        // }, 8000);

        // Handle enable sound button click
        this.enableSoundBtn.addEventListener('click', () => {
            this.enableSound();
            // clearTimeout(autoHideTimeout);
        });

        // Handle Enter key on button
        this.enableSoundBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.enableSound();
                // clearTimeout(autoHideTimeout);
            }
        });

        // Auto-hide on any video interaction
        this.video.addEventListener('click', () => {
            // clearTimeout(autoHideTimeout);
            setTimeout(() => this.hideSoundNotification(), 2000);
        });
    }

    enableSound() {
        if (!this.video) return;

        // Enable audio
        this.video.muted = false;

        // Update mute button state
        if (this.muteBtn) {
            this.muteBtn.textContent = '🔊';
            this.muteBtn.setAttribute('aria-label', 'Mute video');
        }

        // Hide notification
        this.hideSoundNotification();

        // Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sound_enabled', {
                'event_category': 'engagement',
                'event_label': 'Sound Notification'
            });
        }

        console.log('Sound enabled via notification');
    }

    hideSoundNotification() {
        if (this.soundNotification) {
            this.soundNotification.classList.add('hidden');
        }
    }

    setupVideoControls() {
        if (!this.video) return;

        // Auto-hide controls after 3 seconds of no mouse movement
        let controlsTimeout;
        const showControls = () => {
            if (this.videoControls) {
                this.videoControls.style.opacity = '1';
                clearTimeout(controlsTimeout);
                controlsTimeout = setTimeout(() => {
                    this.videoControls.style.opacity = '0';
                }, 3000);
            }
        };

        // Show controls on mouse movement
        this.video.addEventListener('mousemove', showControls);
        this.video.addEventListener('mouseenter', showControls);

        // Play/Pause button
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => {
                if (this.video.paused) {
                    this.video.play();
                    this.playPauseBtn.textContent = '⏸️';
                    this.playPauseBtn.setAttribute('aria-label', 'Pause video');
                } else {
                    this.video.pause();
                    this.playPauseBtn.textContent = '▶️';
                    this.playPauseBtn.setAttribute('aria-label', 'Play video');
                }
                showControls();
            });
        }

        // Mute button
        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => {
                if (this.video.muted) {
                    this.video.muted = false;
                    this.muteBtn.textContent = '🔊';
                    this.muteBtn.setAttribute('aria-label', 'Mute video');
                } else {
                    this.video.muted = true;
                    this.muteBtn.textContent = '🔇';
                    this.muteBtn.setAttribute('aria-label', 'Unmute video');
                }
                showControls();

                // Analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', this.video.muted ? 'video_mute' : 'video_unmute', {
                        'event_category': 'engagement',
                        'event_label': 'Local Video'
                    });
                }
            });
        }

        // Fullscreen button
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    this.video.requestFullscreen().catch(err => {
                        console.log(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                    this.fullscreenBtn.textContent = '⛶';
                    this.fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
                } else {
                    document.exitFullscreen();
                    this.fullscreenBtn.textContent = '⛶';
                    this.fullscreenBtn.setAttribute('aria-label', 'Enter fullscreen');
                }
                showControls();
            });
        }

        // Video event listeners
        this.video.addEventListener('play', () => {
            if (this.playPauseBtn) {
                this.playPauseBtn.textContent = '⏸️';
                this.playPauseBtn.setAttribute('aria-label', 'Pause video');
            }

            // Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_play', {
                    'event_category': 'engagement',
                    'event_label': 'Local Video'
                });
            }
        });

        this.video.addEventListener('pause', () => {
            if (this.playPauseBtn) {
                this.playPauseBtn.textContent = '▶️';
                this.playPauseBtn.setAttribute('aria-label', 'Play video');
            }
        });

        this.video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });

        this.video.addEventListener('canplay', () => {
            console.log('Video can start playing');
            showControls();
        });

        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.showVideoError();
        });

        // Keyboard controls
        this.video.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    if (this.video.paused) {
                        this.video.play();
                    } else {
                        this.video.pause();
                    }
                    break;
                case 'm':
                    e.preventDefault();
                    this.video.muted = !this.video.muted;
                    break;
                case 'f':
                    e.preventDefault();
                    if (!document.fullscreenElement) {
                        this.video.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                    break;
            }
            showControls();
        });

        // Click to play/pause
        this.video.addEventListener('click', () => {
            if (this.video.paused) {
                this.video.play();
            } else {
                this.video.pause();
            }
        });

        // Initial controls setup
        showControls();
    }

    showVideoError() {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'video-error';
        errorMsg.innerHTML = `
            <h3>Video Error</h3>
            <p>Unable to load video.mp4. Please check that the file exists and is accessible.</p>
            <p><a href="./video.mp4" target="_blank">Try downloading the video directly</a></p>
        `;

        if (this.video.parentNode) {
            this.video.parentNode.appendChild(errorMsg);
        }
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new GlobodyneTracker();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}