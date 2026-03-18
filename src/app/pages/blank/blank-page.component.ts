import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blank-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; min-height: 400px;">
      <div style="text-align: center; color: #5a5a78;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <h2 style="color: #c0c0e0; font-family: 'Outfit', sans-serif; font-size: 1.5rem; margin-bottom: 0.5rem; text-transform: capitalize;">{{ featureTitle }}</h2>
        <p>This module is under construction. Dummy data will be added later.</p>
      </div>
    </div>
  `
})
export class BlankPageComponent {
  featureTitle = 'Module';

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const feature = params.get('feature');
      if (feature) {
        this.featureTitle = feature.replace(/-/g, ' ');
      }
    });
  }
}
