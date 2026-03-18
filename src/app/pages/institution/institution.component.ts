import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subscription {
  type: string;
  validUntil: string;
  status: 'active' | 'expiring' | 'inactive';
}

interface Institution {
  id: number;
  name: string;
  noInduk: string;
  location: string;
  subscriptions: Subscription[];
  selected?: boolean;
}

@Component({
  selector: 'app-institution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {
  institutions: Institution[] = [];
  selectedInstitution: Institution | null = null;
  isModalOpen = false;
  isAddModalOpen = false;
  allSelected = false;

  get selectedCount(): number {
    return this.institutions.filter(i => i.selected).length;
  }

  ngOnInit() {
    this.institutions = [
      {
        id: 1,
        name: 'Bank Central Asia',
        noInduk: 'BCA-001-992',
        location: 'Jakarta, Indonesia',
        selected: false,
        subscriptions: [
          { type: 'RBAC', validUntil: '2027-12-31', status: 'active' },
          { type: 'FDS', validUntil: '2026-06-30', status: 'expiring' }
        ]
      },
      {
        id: 2,
        name: 'Nusantara Tech',
        noInduk: 'NST-014-88',
        location: 'Bandung, Indonesia',
        selected: true,
        subscriptions: [
          { type: 'RBAC', validUntil: '2028-01-15', status: 'active' },
          { type: 'FDS-ML', validUntil: '2028-01-15', status: 'active' }
        ]
      },
      {
        id: 3,
        name: 'Global Finance Corp',
        noInduk: 'GFC-003-771',
        location: 'Singapore',
        selected: true,
        subscriptions: [
          { type: 'RBAC', validUntil: '2025-10-10', status: 'expiring' }
        ]
      },
      {
        id: 4,
        name: 'Maju Jaya Retail',
        noInduk: 'MJR-022-105',
        location: 'Surabaya, Indonesia',
        selected: false,
        subscriptions: [
          { type: 'FDS', validUntil: '2023-12-01', status: 'inactive' }
        ]
      },
      {
        id: 5,
        name: 'Fintech Syariah',
        noInduk: 'FTS-044-332',
        location: 'Jakarta, Indonesia',
        selected: false,
        subscriptions: [
          { type: 'RBAC', validUntil: '2026-11-20', status: 'active' },
          { type: 'FDS', validUntil: '2026-11-20', status: 'active' },
          { type: 'FDS-ML', validUntil: '2026-11-20', status: 'active' }
        ]
      },
       {
        id: 6,
        name: 'Koperasi Sejahtera',
        noInduk: 'KSP-991-002',
        location: 'Yogyakarta, Indonesia',
        selected: true,
        subscriptions: [
          { type: 'RBAC', validUntil: '2027-04-12', status: 'active' }
        ]
      }
    ];
  }

  toggleAll() {
    this.allSelected = !this.allSelected;
    this.institutions.forEach(inst => inst.selected = this.allSelected);
  }

  toggleSelection(inst: Institution) {
    inst.selected = !inst.selected;
    this.allSelected = this.institutions.every(i => i.selected);
  }

  openDetailModal(inst: Institution) {
    this.selectedInstitution = inst;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedInstitution = null;
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  addInstitution() {
    alert("New institution data saved implicitly.");
    this.closeAddModal();
  }
}
