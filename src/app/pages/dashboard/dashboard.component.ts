import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface StatCard {
  id: string;
  label: string;
  value: number;
  icon: SafeHtml; // changed to SafeHtml
  gradient: string;
  change: number;        
  changeLabel: string;
}

interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'assign';
}

interface QuickStat {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading = signal(true);
  statCards: StatCard[] = [];

  constructor(private sanitizer: DomSanitizer) {
    this.statCards = [
      {
        id: 'users',
        label: 'Total Users',
        value: 248,
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>`),
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
        change: 12,
        changeLabel: 'vs last month'
      },
      {
        id: 'roles',
        label: 'Total Roles',
        value: 14,
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>`),
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
        change: 2,
        changeLabel: 'new this week'
      },
      {
        id: 'applications',
        label: 'Total Applications',
        value: 37,
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`),
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        change: 5,
        changeLabel: 'vs last month'
      },
      {
        id: 'institutions',
        label: 'Total Institutions',
        value: 12,
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
        </svg>`),
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
        change: -1,
        changeLabel: 'vs last month'
      },
      {
        id: 'groups',
        label: 'Total Groups',
        value: 56,
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>`),
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
        change: 8,
        changeLabel: 'vs last month'
      }
    ];
  }

  // ── Quick Stats ─────────────────────────────────────
  quickStats: QuickStat[] = [
    { label: 'Active Users', value: 189, color: '#10b981' },
    { label: 'Pending Approvals', value: 7, color: '#f59e0b' },
    { label: 'Locked Accounts', value: 3, color: '#ef4444' },
    { label: 'Active Sessions', value: 42, color: '#6366f1' },
  ];

  // ── Recent Activity ──────────────────────────────────
  recentActivity: RecentActivity[] = [
    { id: 1, action: 'New user created', user: 'Budi Santoso', time: '2 min ago', type: 'create' },
    { id: 2, action: 'Role "Editor" assigned', user: 'Siti Rahayu', time: '15 min ago', type: 'assign' },
    { id: 3, action: 'Application "Portal HR" updated', user: 'Admin', time: '1 hr ago', type: 'update' },
    { id: 4, action: 'User logged in', user: 'Andi Wijaya', time: '2 hrs ago', type: 'login' },
    { id: 5, action: 'Institution "BPKP" added', user: 'Admin', time: '3 hrs ago', type: 'create' },
    { id: 6, action: 'Role "Viewer" deleted', user: 'Admin', time: '5 hrs ago', type: 'delete' },
    { id: 7, action: 'User password reset', user: 'Dewi Lestari', time: 'Yesterday', type: 'update' },
  ];

  // ── Role Distribution ────────────────────────────────
  roleDistribution = [
    { name: 'Super Admin', count: 2,  percent: 1,  color: '#6366f1' },
    { name: 'Admin',       count: 18, percent: 7,  color: '#8b5cf6' },
    { name: 'Manager',     count: 45, percent: 18, color: '#06b6d4' },
    { name: 'Operator',    count: 98, percent: 40, color: '#10b981' },
    { name: 'Viewer',      count: 85, percent: 34, color: '#f59e0b' },
  ];

  // ── Top Applications ─────────────────────────────────
  topApplications = [
    { name: 'Portal SDM', users: 145, status: 'active' },
    { name: 'Sistem Keuangan', users: 98, status: 'active' },
    { name: 'E-Office',   users: 87,  status: 'active' },
    { name: 'Monitoring Dashboard', users: 64, status: 'active' },
    { name: 'Helpdesk System', users: 42, status: 'maintenance' },
  ];

  ngOnInit(): void {
    // Simulate data loading
    setTimeout(() => this.isLoading.set(false), 800);
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      create: '➕',
      update: '✏️',
      delete: '🗑️',
      login:  '🔑',
      assign: '🏷️',
    };
    return icons[type] ?? '•';
  }

  getActivityColor(type: string): string {
    const colors: Record<string, string> = {
      create: '#10b981',
      update: '#f59e0b',
      delete: '#ef4444',
      login:  '#6366f1',
      assign: '#06b6d4',
    };
    return colors[type] ?? '#9898b5';
  }

  trackById(_: number, item: any): any { return item.id; }
}
