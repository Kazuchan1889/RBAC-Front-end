import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Group {
  id: string;
  name: string;
  description: string;
  institution: string;
  usersCount: number;
  status: 'active' | 'inactive';
  avatar?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  // Master Data
  allGroups: Group[] = [
    { id: 'G001', name: 'IT Department', description: 'Technical and IT support team', institution: 'Bank Rakyat Indonesia', usersCount: 15, status: 'active', avatar: 'IT' },
    { id: 'G002', name: 'HR Management', description: 'Human resources and recruitment', institution: 'Bank Negara Indonesia', usersCount: 8, status: 'active', avatar: 'HR' },
    { id: 'G003', name: 'Finance Operations', description: 'Financial planning and auditing', institution: 'Bank Mandiri', usersCount: 12, status: 'inactive', avatar: 'FO' },
    { id: 'G004', name: 'Marketing Squad', description: 'Digital marketing and sales', institution: 'Bank Central Asia', usersCount: 20, status: 'active', avatar: 'MS' },
    { id: 'G005', name: 'Customer Support', description: '24/7 customer service center', institution: 'Bank Tabungan Negara', usersCount: 45, status: 'active', avatar: 'CS' }
  ];

  filteredGroups: Group[] = [];
  paginatedGroups: Group[] = [];
  
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
  selectedGroup: Group | null = null;
  allSelected = false;

  // New/Edit Group Form Model
  groupForm: any = {
    name: '',
    description: '',
    institution: '',
    usersCount: 0,
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
    let result = [...this.allGroups];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q) ||
        g.institution.toLowerCase().includes(q)
      );
    }
    if (this.selectedStatus !== 'all') {
      result = result.filter(g => g.status === this.selectedStatus);
    }
    this.filteredGroups = result;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredGroups.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGroups = this.filteredGroups.slice(startIndex, endIndex);
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
    this.groupForm = { name: '', description: '', institution: '', usersCount: 0, status: 'active' };
    this.isAddModalOpen = true;
  }

  openEditModal(group: Group) {
    this.selectedGroup = group;
    this.groupForm = { ...group };
    this.isEditModalOpen = true;
  }

  openDetailModal(group: Group) {
    this.selectedGroup = { ...group };
    this.isDetailModalOpen = true;
  }

  saveGroup() {
    if (!this.groupForm.name || !this.groupForm.institution) {
      alert('Please fill mandatory fields (Name and Institution)');
      return;
    }

    if (this.isEditModalOpen && this.selectedGroup) {
      // Update logic
      const index = this.allGroups.findIndex(g => g.id === this.selectedGroup?.id);
      if (index !== -1) {
        this.allGroups[index] = { 
          ...this.allGroups[index], 
          ...this.groupForm,
          avatar: this.groupForm.name.split(' ').map((n:any) => n[0]).join('').toUpperCase().substring(0,2)
        };
      }
    } else {
      // Create logic
      const newGroup: Group = {
        id: 'G' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        ...this.groupForm,
        usersCount: this.groupForm.usersCount || 0,
        avatar: this.groupForm.name.split(' ').map((n:any) => n[0]).join('').toUpperCase().substring(0,2)
      };
      this.allGroups.unshift(newGroup); // Add to top
    }

    this.applyFilters();
    this.closeModals();
  }

  deleteGroup(group: Group) {
    if (confirm(`Are you sure you want to delete ${group.name}?`)) {
      this.allGroups = this.allGroups.filter(g => g.id !== group.id);
      this.applyFilters();
    }
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedGroup = null;
  }

  closeModals() {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDetailModalOpen = false;
    this.selectedGroup = null;
  }

  toggleAll() {
    this.allSelected = !this.allSelected;
    this.paginatedGroups.forEach(g => g.selected = this.allSelected);
  }

  toggleSelection(group: Group) {
    group.selected = !group.selected;
    this.updateSelectionState();
  }

  updateSelectionState() {
    this.allSelected = this.paginatedGroups.length > 0 && this.paginatedGroups.every(g => g.selected);
  }

  getstartIndex() { return (this.currentPage - 1) * this.pageSize + 1; }
  getendIndex() { return Math.min(this.currentPage * this.pageSize, this.filteredGroups.length); }
}
