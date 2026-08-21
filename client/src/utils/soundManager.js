// client/src/utils/soundManager.js
import { useSettingsStore } from '../store/settingsStore';

// Pre-load audio objects (Make sure to add these files to your public/sounds/ folder later)
const sounds = {
  swipe: new Audio('/sounds/swipe.mp3'),
  buzzer: new Audio('/sounds/buzzer.mp3'),
  success: new Audio('/sounds/success.mp3'),
  airhorn: new Audio('/sounds/airhorn.mp3'),
  cheer: new Audio('/sounds/cheer.mp3'),
  boo: new Audio('/sounds/boo.mp3')
};

// Global Vibration Trigger
export const triggerVibration = (pattern = 40) => {
  const { hapticsEnabled } = useSettingsStore.getState();
  
  // Check if user enabled haptics AND if the device supports it
  if (hapticsEnabled && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(pattern);
  }
};

// Global Sound Trigger
export const playSound = (soundName = 'swipe') => {
  const { soundEnabled } = useSettingsStore.getState();
  
  if (soundEnabled && sounds[soundName]) {
    sounds[soundName].currentTime = 0; // Rewind to start for rapid clicking
    sounds[soundName].play().catch(err => {
      console.log('Audio autoplay prevented by browser until user interacts:', err);
    });
  }
};
