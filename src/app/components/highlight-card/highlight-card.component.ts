import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highlight-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './highlight-card.component.html',
  styleUrl: './highlight-card.component.scss'
})
export class HighlightCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl?: string;
}
