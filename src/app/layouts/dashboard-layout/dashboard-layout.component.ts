import { Component, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  currentTime = signal(new Date());
  
  // ── Route Title State ──
  pageTitle = signal('Dashboard');

  // ── Dropdown States ──
  showNotifications = signal(false);
  showProfileMenu = signal(false);
  mobileMenuOpen = false;

  constructor(private router: Router) {
    // Update title dynamically based on route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.updateTitleFromUrl(url);
    });
  }

  ngOnInit(): void {
    setInterval(() => this.currentTime.set(new Date()), 60000);
    this.updateTitleFromUrl(this.router.url);
  }

  private updateTitleFromUrl(url: string) {
    const segments = url.split('/').filter(s => s);
    if (segments.length > 1) {
      const feature = segments[1];
      this.pageTitle.set(feature.charAt(0).toUpperCase() + feature.slice(1).replace('-', ' '));
    } else {
      this.pageTitle.set('Dashboard');
    }
  }

  get formattedDate(): string {
    return this.currentTime().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  get formattedTime(): string {
    return this.currentTime().toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications.update(v => !v);
    this.showProfileMenu.set(false);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.showProfileMenu.update(v => !v);
    this.showNotifications.set(false);
  }

  @HostListener('document:click')
  closeDropdowns(): void {
    this.showNotifications.set(false);
    this.showProfileMenu.set(false);
  }
}
