import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ActionPermission {
  id: string;
  label: string;
  type: 'view' | 'create' | 'update' | 'delete' | 'approve' | 'export';
  granted: boolean;
}

interface ModulePermission {
  moduleName: string;
  icon: string;
  expanded: boolean;
  actions: ActionPermission[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: 'active' | 'inactive';
  selected?: boolean;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  roles: Role[] = [
    { id: 'R1', name: 'Super Admin', description: 'Full access to all system modules and approval authorities', userCount: 3, status: 'active' },
    { id: 'R2', name: 'Institution Admin', description: 'Manage specific institution data, users, and operational approvals', userCount: 12, status: 'active' },
    { id: 'R3', name: 'Operator', description: 'Daily data entry and basic reporting tasks', userCount: 45, status: 'active' },
    { id: 'R4', name: 'Auditor', description: 'Read-only access for compliance checking across all modules', userCount: 5, status: 'inactive' }
  ];

  // Hierarchical Permission Structure
  permissionStructure: ModulePermission[] = [
    {
      moduleName: 'Dashboard',
      icon: '📊',
      expanded: true,
      actions: [
        { id: 'dash_v', label: 'View Analytics', type: 'view', granted: true },
        { id: 'dash_e', label: 'Export Stats', type: 'export', granted: false }
      ]
    },
    {
      moduleName: 'Institution Management',
      icon: '🏦',
      expanded: false,
      actions: [
        { id: 'inst_v', label: 'View Table Data', type: 'view', granted: true },
        { id: 'inst_c', label: 'Create New Institution', type: 'create', granted: true },
        { id: 'inst_u', label: 'Update Details', type: 'update', granted: false },
        { id: 'inst_d', label: 'Delete Records', type: 'delete', granted: false },
        { id: 'inst_a', label: 'Approve Subscriptions', type: 'approve', granted: true }
      ]
    },
    {
      moduleName: 'User Management',
      icon: '👤',
      expanded: false,
      actions: [
        { id: 'user_v', label: 'View User List', type: 'view', granted: true },
        { id: 'user_c', label: 'Invite Users', type: 'create', granted: true },
        { id: 'user_u', label: 'Edit Profiles', type: 'update', granted: true },
        { id: 'user_d', label: 'Terminate Access', type: 'delete', granted: false },
        { id: 'user_a', label: 'Approve Role Changes', type: 'approve', granted: false }
      ]
    },
    {
      moduleName: 'Financial Logs',
      icon: '💰',
      expanded: false,
      actions: [
        { id: 'fin_v', label: 'View Transactions', type: 'view', granted: true },
        { id: 'fin_a', label: 'Approve Disbursements', type: 'approve', granted: false },
        { id: 'fin_e', label: 'Export Reports', type: 'export', granted: true }
      ]
    }
  ];

  isAddModalOpen = false;
  isDetailModalOpen = false;
  selectedRole: Role | null = null;
  allSelected = false;

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  openDetailModal(role: Role) {
    this.selectedRole = { ...role };
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedRole = null;
  }

  toggleModule(mod: ModulePermission) {
    mod.expanded = !mod.expanded;
  }

  toggleAll() {
    this.allSelected = !this.allSelected;
    this.roles.forEach(r => r.selected = this.allSelected);
  }

  toggleSelection(role: Role) {
    role.selected = !role.selected;
    this.allSelected = this.roles.every(r => r.selected);
  }

  saveRole() {
    alert('Role and Permission Hierarchy saved!');
    this.closeAddModal();
  }
}
