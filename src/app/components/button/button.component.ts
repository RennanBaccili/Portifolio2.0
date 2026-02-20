import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  LINK = 'link'
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = ButtonVariant.PRIMARY;
  @Input() href?: string;
  @Input() type: ButtonType = ButtonType.LINK;
  @Input() disabled: boolean = false;
  @Input() ariaLabel?: string;
  @Input() title?: string;
  @Input() text?: string; 
  @Input() targetValue?: string = '_self';

  ButtonVariant = ButtonVariant;
  ButtonType = ButtonType;

  get isLink(): boolean {
    return this.type === ButtonType.LINK && !!this.href;
  }

  get variantClass(): string {
    return `btn btn-${this.variant}`;
  }

  get typeValue(): string {
    return this.type;
  }

  get ariaLabelValue(): string | null {
    return this.ariaLabel || null;
  }

  get titleValue(): string | null {
    return this.title || null;
  }
}
