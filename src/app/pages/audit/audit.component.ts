import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuditLog {
  id: string;
  action: string;
  module: string;
  actor: string;
  actorRole: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  detail: string;
  changes?: { field: string; before: string; after: string }[];
  selected?: boolean;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  allLogs: AuditLog[] = [
    {
      id: 'LOG001', action: 'User Login', module: 'Authentication', actor: 'Adrian Syah', actorRole: 'Super Admin',
      target: 'System', ipAddress: '192.168.1.10', timestamp: '2024-03-18 09:30:12', status: 'success',
      detail: 'Successful login via username & password.',
      changes: []
    },
    {
      id: 'LOG002', action: 'Role Updated', module: 'Role Management', actor: 'Adrian Syah', actorRole: 'Super Admin',
      target: 'Role: Operator', ipAddress: '192.168.1.10', timestamp: '2024-03-18 09:45:33', status: 'success',
      detail: 'Permissions modified for the Operator role.',
      changes: [
        { field: 'Institution – Delete', before: 'Granted', after: 'Revoked' },
        { field: 'Financial Logs – Approve', before: 'Revoked', after: 'Granted' }
      ]
    },
    {
      id: 'LOG003', action: 'User Creation Failed', module: 'User Management', actor: 'Bella Clarita', actorRole: 'Institution Admin',
      target: 'diana@bca.co.id', ipAddress: '10.0.0.45', timestamp: '2024-03-18 10:12:05', status: 'failed',
      detail: 'Email domain not whitelisted for institution BCA.',
      changes: []
    },
    {
      id: 'LOG004', action: 'Institution Registered', module: 'Institution Management', actor: 'Adrian Syah', actorRole: 'Super Admin',
      target: 'Inst: Bank Tabungan Negara', ipAddress: '192.168.1.10', timestamp: '2024-03-18 11:02:44', status: 'success',
      detail: 'New institution BTN registered with RBAC subscription.',
      changes: [
        { field: 'Name', before: '-', after: 'Bank Tabungan Negara' },
        { field: 'Subscription', before: '-', after: 'RBAC' }
      ]
    },
    {
      id: 'LOG005', action: 'Suspicious Login Attempt', module: 'Authentication', actor: 'Unknown', actorRole: '-',
      target: 'admin@system.id', ipAddress: '45.33.32.156', timestamp: '2024-03-18 11:55:01', status: 'warning',
      detail: 'Multiple failed login attempts from unknown IP. Account temporarily locked.',
      changes: []
    },
    {
      id: 'LOG006', action: 'App Registered', module: 'Application Management', actor: 'Erick Thohir', actorRole: 'Operator',
      target: 'App: LoanTrack Pro', ipAddress: '10.0.0.88', timestamp: '2024-03-18 12:30:20', status: 'success',
      detail: 'New application endpoint registered and set to "Pending" status.',
      changes: [
        { field: 'Status', before: '-', after: 'Pending' },
        { field: 'URL', before: '-', after: 'https://loantrack.ksp-sejahtera.id' }
      ]
    },
    {
      id: 'LOG007', action: 'User Deleted', module: 'User Management', actor: 'Adrian Syah', actorRole: 'Super Admin',
      target: 'User: Lutfi Hakim', ipAddress: '192.168.1.10', timestamp: '2024-03-18 14:05:00', status: 'warning',
      detail: 'User account permanently deleted. All access revoked immediately.',
      changes: []
    }
  ];

  filteredLogs: AuditLog[] = [];
  paginatedLogs: AuditLog[] = [];

  searchQuery = '';
  selectedStatus = 'all';
  selectedModule = 'all';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pages: number[] = [];
  allSelected = false;

  isDetailOpen = false;
  selectedLog: AuditLog | null = null;

  get modules(): string[] {
    return [...new Set(this.allLogs.map(l => l.module))];
  }

  ngOnInit() { this.applyFilters(); }

  onSearch() { this.currentPage = 1; this.applyFilters(); }
  filterByStatus(s: string) { this.selectedStatus = s; this.currentPage = 1; this.applyFilters(); }
  filterByModule(m: string) { this.selectedModule = m; this.currentPage = 1; this.applyFilters(); }

  applyFilters() {
    let result = [...this.allLogs];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q)
      );
    }
    if (this.selectedStatus !== 'all') result = result.filter(l => l.status === this.selectedStatus);
    if (this.selectedModule !== 'all') result = result.filter(l => l.module === this.selectedModule);
    this.filteredLogs = result;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedLogs = this.filteredLogs.slice(start, start + this.pageSize);
    this.allSelected = this.paginatedLogs.length > 0 && this.paginatedLogs.every(l => l.selected);
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) { this.currentPage = p; this.updatePaginatedData(); }
  }

  toggleAll() { this.allSelected = !this.allSelected; this.paginatedLogs.forEach(l => l.selected = this.allSelected); }
  toggleSelection(log: AuditLog) { log.selected = !log.selected; this.allSelected = this.paginatedLogs.every(l => l.selected); }

  openDetail(log: AuditLog) { this.selectedLog = { ...log }; this.isDetailOpen = true; }
  closeDetail() { this.isDetailOpen = false; this.selectedLog = null; }

  countByStatus(s: string) { return this.allLogs.filter(l => l.status === s).length; }
  getStartIndex() { return (this.currentPage - 1) * this.pageSize + 1; }
  getEndIndex() { return Math.min(this.currentPage * this.pageSize, this.filteredLogs.length); }
}
