import bgMusic from './assets/bg-music.mp3';

const audio = new Audio(bgMusic);
audio.loop = true;

let initialized = false;

export function initMusic() {
  if (initialized) return;
  initialized = true;
  if (localStorage.getItem('music') !== 'off') {
    audio.play().catch(() => {});
  }
}

export function pauseMusic() {
  audio.pause();
}

export function resumeMusic() {
  audio.play().catch(() => {});
}

export function setVolume(value: number) {
  audio.volume = value;
}
