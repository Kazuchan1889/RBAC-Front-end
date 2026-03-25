import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Notification {
  id: number;
  type: 'system' | 'security' | 'user' | 'role';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('0.3s {{delay}}ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: 0 } })
    ])
  ]
})
export class NotificationsComponent {
  
  notifications = signal<Notification[]>([
    {
      id: 1,
      type: 'security',
      title: 'New device login detected',
      message: 'A successful login was made from a new Mac device in Jakarta, Indonesia. If this was not you, please secure your account immediately.',
      time: 'Just now',
      isRead: false
    },
    {
      id: 2,
      type: 'role',
      title: 'Role "Super Admin" updated',
      message: 'System Administrator modified the permissions for the "Super Admin" role. 2 new permissions were added regarding billing and subscription management.',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'user',
      title: 'New user registration pending',
      message: 'Anew user "Budi Santoso" has registered and is waiting for administrator approval to access the Portal HR application.',
      time: 'Yesterday',
      isRead: true
    },
    {
      id: 4,
      type: 'system',
      title: 'System update completed',
      message: 'RBAC core system has been successfully updated to version 2.4.1. This includes performance improvements and minor bug fixes.',
      time: '2 days ago',
      isRead: true
    },
    {
      id: 5,
      type: 'security',
      title: 'Multiple failed login attempts',
      message: 'We detected 5 consecutive failed login attempts on account "Andi.W". The account has been temporarily locked for 15 minutes as a security precaution.',
      time: '3 days ago',
      isRead: true
    },
    {
      id: 6,
      type: 'system',
      title: 'Scheduled maintenance notice',
      message: 'A scheduled maintenance window is planned for this Friday at 02:00 AM (GMT+7). The system may experience brief downtime.',
      time: '4 days ago',
      isRead: true
    }
  ]);

  filterType = signal<'all' | 'unread'>('all');

  filteredNotifications = computed(() => {
    const list = this.notifications();
    if (this.filterType() === 'unread') {
      return list.filter(n => !n.isRead);
    }
    return list;
  });

  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  selectedNotification = signal<Notification | null>(null);

  viewDetails(id: number) {
    this.markAsRead(id);
    const notif = this.notifications().find(n => n.id === id);
    if (notif) {
      this.selectedNotification.set(notif);
    }
  }

  closeDetails() {
    this.selectedNotification.set(null);
  }

  markAsRead(id: number) {
    this.notifications.update(list => 
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(list => 
      list.map(n => ({ ...n, isRead: true }))
    );
  }

  deleteNotification(id: number, event: Event) {
    event.stopPropagation();
    this.notifications.update(list => list.filter(n => n.id !== id));
    if (this.selectedNotification()?.id === id) {
      this.closeDetails();
    }
  }

  getIconForType(type: string): string {
    switch(type) {
      case 'security': return '🛡️';
      case 'system': return '⚙️';
      case 'user': return '👤';
      case 'role': return '🔐';
      default: return '🔔';
    }
  }

  getColorForType(type: string): string {
    switch(type) {
      case 'security': return 'rgba(244, 63, 94, 0.1)'; // rose
      case 'system': return 'rgba(99, 102, 241, 0.1)'; // indigo
      case 'user': return 'rgba(16, 185, 129, 0.1)'; // emerald
      case 'role': return 'rgba(245, 158, 11, 0.1)'; // amber
      default: return 'rgba(255,255,255,0.05)';
    }
  }
}
