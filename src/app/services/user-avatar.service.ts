import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'rbac_user_avatar';

@Injectable({ providedIn: 'root' })
export class UserAvatarService {
  // Reactive signal — any component reading this will update automatically
  avatarUrl = signal<string | null>(null);

  constructor() {
    // Load from localStorage on startup
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this.avatarUrl.set(saved);
    }
  }

  setAvatar(dataUrl: string) {
    localStorage.setItem(STORAGE_KEY, dataUrl);
    this.avatarUrl.set(dataUrl);
  }

  clearAvatar() {
    localStorage.removeItem(STORAGE_KEY);
    this.avatarUrl.set(null);
  }
}
