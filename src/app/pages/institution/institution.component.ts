import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subscription {
  type: string;
  validUntil: string;
  status: 'active' | 'expiring' | 'inactive';
}

interface OrgRole {
  id: string;
  name: string;
  permissions: string[];
}

interface OrgGroup {
  id: string;
  name: string;
  roles: OrgRole[];
}

interface Institution {
  id: number;
  name: string;
  noInduk: string;
  location: string;
  subscriptions: Subscription[];
  groups: OrgGroup[];
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

  // Diagram state
  isDiagramModalOpen = false;
  activeInstitutionForDiagram: Institution | null = null;
  editingNode: any = null;
  isEditNodeModalOpen = false;

  get selectedCount(): number {
    return this.institutions.filter(i => i.selected).length;
  }

  ngOnInit() {
    const defaultGroups: OrgGroup[] = [
      {
        id: 'G1', name: 'Engineering (ENG)', roles: [
          { id: 'R1', name: 'Process Owner', permissions: ['Define Process', 'Audit'] },
          { id: 'R2', name: 'Implementer', permissions: ['Execute Task', 'Report'] }
        ]
      },
      {
        id: 'G2', name: 'Quality Assurance (QA)', roles: [
          { id: 'R3', name: 'Lead Appraiser', permissions: ['Assess Maturity', 'Audit'] },
          { id: 'R4', name: 'Quality Analyst', permissions: ['Review Output'] }
        ]
      },
      {
        id: 'G3', name: 'Project Management (PM)', roles: [
          { id: 'R5', name: 'Project Manager', permissions: ['Manage Risk', 'Allocate Resource'] }
        ]
      }
    ];

    this.institutions = [
      {
        id: 1,
        name: 'Bank Central Asia',
        noInduk: 'BCA-001-992',
        location: 'Jakarta, Indonesia',
        selected: false,
        groups: JSON.parse(JSON.stringify(defaultGroups)),
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
        groups: JSON.parse(JSON.stringify(defaultGroups)),
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
        groups: JSON.parse(JSON.stringify(defaultGroups)),
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
        groups: JSON.parse(JSON.stringify(defaultGroups)),
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
        groups: JSON.parse(JSON.stringify(defaultGroups)),
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
        groups: JSON.parse(JSON.stringify(defaultGroups)),
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

  openDiagramModal(inst: Institution) {
    this.activeInstitutionForDiagram = inst;
    this.isDiagramModalOpen = true;
  }

  closeDiagramModal() {
    this.isDiagramModalOpen = false;
    this.activeInstitutionForDiagram = null;
  }

  editNode(node: any, type: 'group' | 'role') {
    this.editingNode = { ...node, type };
    this.isEditNodeModalOpen = true;
  }

  saveNode() {
    if (this.editingNode && this.activeInstitutionForDiagram) {
      if (this.editingNode.type === 'group') {
        const idx = this.activeInstitutionForDiagram.groups.findIndex(g => g.id === this.editingNode.id);
        if (idx !== -1) {
          this.activeInstitutionForDiagram.groups[idx].name = this.editingNode.name;
        }
      } else if (this.editingNode.type === 'role') {
        for (let g of this.activeInstitutionForDiagram.groups) {
          const rIdx = g.roles.findIndex(r => r.id === this.editingNode.id);
          if (rIdx !== -1) {
             g.roles[rIdx].name = this.editingNode.name;
             break;
          }
        }
      }
      this.isEditNodeModalOpen = false;
      this.editingNode = null;
    }
  }

  closeEditNodeModal() {
    this.isEditNodeModalOpen = false;
    this.editingNode = null;
  }

  addGroup() {
    if(this.activeInstitutionForDiagram) {
        this.activeInstitutionForDiagram.groups.push({
            id: 'G' + Math.floor(Math.random() * 1000),
            name: 'New Process Area',
            roles: []
        });
    }
  }

  addRole(group: OrgGroup) {
     group.roles.push({
         id: 'R' + Math.floor(Math.random() * 1000),
         name: 'New Role',
         permissions: []
     });
  }
}

