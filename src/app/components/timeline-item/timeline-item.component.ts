import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss'
})
export class TimelineItemComponent {
  @Input() title: string = '';
  @Input() company: string = '';
  @Input() period?: string;
  @Input() items: string[] = [];

  get hasItems(): boolean {
    return this.items && this.items.length > 0;
  }
}
