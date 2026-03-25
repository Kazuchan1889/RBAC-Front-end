import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Application {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  category: string;
  registeredAt: string;
  selected?: boolean;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  allApplications: Application[] = [
    { id: 'APP001', name: 'CoreBanking Portal', url: 'https://corebanking.bri.co.id', description: 'Primary banking transaction system for BRI branch operations.', status: 'connected', category: 'Core System', registeredAt: '2024-01-12' },
    { id: 'APP002', name: 'HR Nexus', url: 'https://hrnexus.nusantara.id', description: 'Human resource management and payroll integration platform.', status: 'connected', category: 'HR & Payroll', registeredAt: '2024-02-05' },
    { id: 'APP003', name: 'Compliance Audit Suite', url: 'https://audit.gfc-intl.com', description: 'Automated audit trail and regulatory compliance reporting.', status: 'disconnected', category: 'Compliance', registeredAt: '2024-01-29' },
    { id: 'APP004', name: 'Syariah Finance Gateway', url: 'https://gateway.fintech-syariah.co.id', description: 'Sharia-compliant financial transaction processing gateway.', status: 'pending', category: 'Finance', registeredAt: '2024-03-03' },
    { id: 'APP005', name: 'DataVault Analytics', url: 'https://analytics.datavault.io', description: 'Business intelligence and real-time analytics dashboard.', status: 'connected', category: 'Analytics', registeredAt: '2024-03-10' },
    { id: 'APP006', name: 'SecureID Auth', url: 'https://auth.secureid.co.id', description: 'Multi-factor authentication management and SSO provider.', status: 'connected', category: 'Security', registeredAt: '2024-02-20' },
    { id: 'APP007', name: 'LoanTrack Pro', url: 'https://loantrack.ksp-sejahtera.id', description: 'Loan origination, monitoring, and collection management.', status: 'disconnected', category: 'Lending', registeredAt: '2024-01-18' },
  ];

  filteredApps: Application[] = [];
  paginatedApps: Application[] = [];

  searchQuery = '';
  selectedStatus = 'all';

  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pages: number[] = [];
  allSelected = false;

  isAddModalOpen = false;
  isEditModalOpen = false;
  isDetailModalOpen = false;
  selectedApp: Application | null = null;

  appForm: Partial<Application> = {};

  ngOnInit() {
    this.applyFilters();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allApplications];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.url.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }
    if (this.selectedStatus !== 'all') {
      result = result.filter(a => a.status === this.selectedStatus);
    }
    this.filteredApps = result;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredApps.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedApps = this.filteredApps.slice(start, start + this.pageSize);
    this.allSelected = this.paginatedApps.length > 0 && this.paginatedApps.every(a => a.selected);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  toggleAll() {
    this.allSelected = !this.allSelected;
    this.paginatedApps.forEach(a => a.selected = this.allSelected);
  }

  toggleSelection(app: Application) {
    app.selected = !app.selected;
    this.allSelected = this.paginatedApps.every(a => a.selected);
  }

  openAddModal() {
    this.appForm = { status: 'pending', category: 'Core System' };
    this.isAddModalOpen = true;
  }

  openEditModal(app: Application) {
    this.selectedApp = app;
    this.appForm = { ...app };
    this.isEditModalOpen = true;
  }

  openDetailModal(app: Application) {
    this.selectedApp = { ...app };
    this.isDetailModalOpen = true;
  }

  saveApp() {
    if (!this.appForm.name || !this.appForm.url) {
      alert('App Name and URL are required.');
      return;
    }
    if (this.isEditModalOpen && this.selectedApp) {
      const idx = this.allApplications.findIndex(a => a.id === this.selectedApp?.id);
      if (idx !== -1) {
        this.allApplications[idx] = { ...this.allApplications[idx], ...this.appForm } as Application;
      }
    } else {
      const newApp: Application = {
        id: 'APP' + Math.floor(Math.random() * 900 + 100),
        name: this.appForm.name!,
        url: this.appForm.url!,
        description: this.appForm.description || '-',
        status: (this.appForm.status as any) || 'pending',
        category: this.appForm.category || 'General',
        registeredAt: new Date().toISOString().split('T')[0],
      };
      this.allApplications.unshift(newApp);
    }
    this.closeModals();
    this.applyFilters();
  }

  deleteApp(app: Application) {
    if (confirm(`Delete "${app.name}"? This cannot be undone.`)) {
      this.allApplications = this.allApplications.filter(a => a.id !== app.id);
      this.applyFilters();
    }
  }

  closeModals() {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDetailModalOpen = false;
    this.selectedApp = null;
    this.appForm = {};
  }

  getStartIndex() { return (this.currentPage - 1) * this.pageSize + 1; }
  getEndIndex() { return Math.min(this.currentPage * this.pageSize, this.filteredApps.length); }
  countByStatus(status: string) { return this.allApplications.filter(a => a.status === status).length; }
}
