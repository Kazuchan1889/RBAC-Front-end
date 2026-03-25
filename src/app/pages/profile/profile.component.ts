import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserAvatarService } from '../../services/user-avatar.service';
import { ThemeService } from '../../services/theme.service';

type ActiveTab = 'identity' | 'security' | 'preferences';
type PasswordStep = 'form' | 'otp' | 'success';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {

  constructor(
    private sanitizer: DomSanitizer,
    public avatarService: UserAvatarService,
    public themeService: ThemeService
  ) {}

  activeTab: ActiveTab = 'identity';
  isSaving = false;
  saveSuccess = false;

  // --- Photo Upload ---
  isPhotoModalOpen = false;
  isDragOver = false;
  photoPreview: SafeUrl | null = null;
  selectedFile: File | null = null;
  photoApplied = false;

  // --- Identity Form ---
  profile = {
    fullName: 'Admin RBAC',
    displayName: 'Admin',
    email: 'admin@rbac.co.id',
    phone: '+62 812 0000 0001',
    jobTitle: 'System Administrator',
    department: 'Information Technology',
    institution: 'RBAC Platform',
    bio: 'Super admin responsible for RBAC platform governance and system-wide role configurations.',
    avatar: 'AR'
  };

  // --- Password Change Flow ---
  passwordStep: PasswordStep = 'form';

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  otpDigits = ['', '', '', '', '', ''];
  otpError = '';
  passwordError = '';
  showCurrentPwd = false;
  showNewPwd = false;
  showConfirmPwd = false;

  setTab(tab: ActiveTab) {
    this.activeTab = tab;
  }

  // --- Photo Modal ---
  openPhotoModal() {
    this.isPhotoModalOpen = true;
    this.photoPreview = null;
    this.selectedFile = null;
    this.isDragOver = false;
  }

  closePhotoModal() {
    this.isPhotoModalOpen = false;
    this.photoPreview = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    this.selectedFile = file;
    // Show a local preview via object URL
    const url = URL.createObjectURL(file);
    this.photoPreview = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  applyPhoto() {
    if (!this.selectedFile) return;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const dataUrl = e.target?.result as string;
      // Persist to localStorage via service (updates topbar + profile avatar)
      this.avatarService.setAvatar(dataUrl);
      this.photoApplied = true;
      this.closePhotoModal();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  // --- Identity Save ---
  saveProfile() {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.saveSuccess = true;
      setTimeout(() => this.saveSuccess = false, 3000);
    }, 1200);
  }

  // --- Password Flow ---
  requestOtp() {
    this.passwordError = '';
    if (!this.passwordForm.currentPassword) {
      this.passwordError = 'Current password is required.'; return;
    }
    if (this.passwordForm.newPassword.length < 8) {
      this.passwordError = 'New password must be at least 8 characters.'; return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'Passwords do not match.'; return;
    }
    // Proceed to OTP step
    this.passwordStep = 'otp';
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError = '';
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    this.otpDigits[index] = val.slice(-1);
    // Auto-focus next
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  }

  verifyOtp() {
    const code = this.otpDigits.join('');
    if (code.length < 6) {
      this.otpError = 'Please enter the complete 6-digit OTP.'; return;
    }
    // For now OTP is empty — just accept any 6-digit input
    this.passwordStep = 'success';
    this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

  resetPasswordFlow() {
    this.passwordStep = 'form';
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError = '';
    this.passwordError = '';
  }

  get passwordStrength(): { label: string; color: string; width: string } {
    const p = this.passwordForm.newPassword;
    if (!p) return { label: '', color: '', width: '0%' };
    if (p.length < 6) return { label: 'Weak', color: '#f43f5e', width: '25%' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: '#f59e0b', width: '55%' };
    if (/[!@#$%^&*]/.test(p)) return { label: 'Strong', color: '#10b981', width: '100%' };
    return { label: 'Good', color: '#6366f1', width: '80%' };
  }
}
