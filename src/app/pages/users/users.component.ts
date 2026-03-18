import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  // Master Data
  allUsers: User[] = [
    { id: 'U001', name: 'Adrian Syah', email: 'adrian@bri.co.id', role: 'Super Admin', institution: 'Bank Rakyat Indonesia', status: 'active', lastLogin: '2024-03-18 09:30', avatar: 'AS' },
    { id: 'U002', name: 'Bella Clarita', email: 'bella@bni.co.id', role: 'Institution Admin', institution: 'Bank Negara Indonesia', status: 'active', lastLogin: '2024-03-17 14:20', avatar: 'BC' },
    { id: 'U003', name: 'Candra Wijaya', email: 'candra@mandiri.id', role: 'Operator', institution: 'Bank Mandiri', status: 'inactive', lastLogin: '2024-03-10 11:05', avatar: 'CW' },
    { id: 'U004', name: 'Diana Putri', email: 'diana@bca.co.id', role: 'Auditor', institution: 'Bank Central Asia', status: 'pending', lastLogin: '-', avatar: 'DP' },
    { id: 'U005', name: 'Erick Thohir', email: 'erick@btn.id', role: 'Operator', institution: 'Bank Tabungan Negara', status: 'active', lastLogin: '2024-03-18 08:15', avatar: 'ET' },
    { id: 'U006', name: 'Farhan Hamid', email: 'farhan@bri.co.id', role: 'Operator', institution: 'Bank Rakyat Indonesia', status: 'active', lastLogin: '2024-03-18 10:00', avatar: 'FH' },
    { id: 'U007', name: 'Gita Permata', email: 'gita@bni.co.id', role: 'Auditor', institution: 'Bank Negara Indonesia', status: 'inactive', lastLogin: '2024-03-15 16:45', avatar: 'GP' }
  ];

  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  
  // Search & Filter
  searchQuery = '';
  selectedStatus = 'all';
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  pages: number[] = [];

  // Modals & Forms
  isAddModalOpen = false;
  isEditModalOpen = false;
  isDetailModalOpen = false;
  selectedUser: User | null = null;
  allSelected = false;

  // New/Edit User Form Model
  userForm: any = {
    name: '',
    email: '',
    role: 'Operator',
    institution: '',
    status: 'active'
  };

  ngOnInit() {
    this.applyFilters();
  }

  // --- Logic Chain ---
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
    let result = [...this.allUsers];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        u.institution.toLowerCase().includes(q)
      );
    }
    if (this.selectedStatus !== 'all') {
      result = result.filter(u => u.status === this.selectedStatus);
    }
    this.filteredUsers = result;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
    this.updateSelectionState();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  // --- Actions & CRUD ---
  openAddModal() {
    this.userForm = { name: '', email: '', role: 'Operator', institution: '', status: 'active' };
    this.isAddModalOpen = true;
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.userForm = { ...user };
    this.isEditModalOpen = true;
  }

  openDetailModal(user: User) {
    this.selectedUser = { ...user };
    this.isDetailModalOpen = true;
  }

  saveUser() {
    if (!this.userForm.name || !this.userForm.email) {
      alert('Please fill mandatory fields (Name and Email)');
      return;
    }

    if (this.isEditModalOpen && this.selectedUser) {
      // Update logic
      const index = this.allUsers.findIndex(u => u.id === this.selectedUser?.id);
      if (index !== -1) {
        this.allUsers[index] = { 
          ...this.allUsers[index], 
          ...this.userForm,
          avatar: this.userForm.name.split(' ').map((n:any) => n[0]).join('').toUpperCase().substring(0,2)
        };
      }
    } else {
      // Create logic
      const newUser: User = {
        id: 'U' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        ...this.userForm,
        lastLogin: '-',
        avatar: this.userForm.name.split(' ').map((n:any) => n[0]).join('').toUpperCase().substring(0,2)
      };
      this.allUsers.unshift(newUser); // Add to top
    }

    this.applyFilters();
    this.closeModals();
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.allUsers = this.allUsers.filter(u => u.id !== user.id);
      this.applyFilters();
    }
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedUser = null;
  }

  closeModals() {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDetailModalOpen = false;
    this.selectedUser = null;
  }

  toggleAll() {
    this.allSelected = !this.allSelected;
    this.paginatedUsers.forEach(u => u.selected = this.allSelected);
  }

  toggleSelection(user: User) {
    user.selected = !user.selected;
    this.updateSelectionState();
  }

  updateSelectionState() {
    this.allSelected = this.paginatedUsers.length > 0 && this.paginatedUsers.every(u => u.selected);
  }

  getstartIndex() { return (this.currentPage - 1) * this.pageSize + 1; }
  getendIndex() { return Math.min(this.currentPage * this.pageSize, this.filteredUsers.length); }
}
