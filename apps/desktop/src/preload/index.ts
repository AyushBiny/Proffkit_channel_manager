/**
 * Electron Preload Script - Proffkit Reception PC
 */

export interface DesktopBridge {
  platform: string;
  isOfflineMode: () => boolean;
}

export const bridge: DesktopBridge = {
  platform: 'electron-reception-pc',
  isOfflineMode: () => !navigator.onLine,
};

