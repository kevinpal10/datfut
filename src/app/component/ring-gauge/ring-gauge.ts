import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Anillo de progreso SVG animado, layout horizontal (gauge + texto al lado).
 * Tema oscuro.
 */
@Component({
  selector: 'app-ring-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ring-card">
      <svg [attr.width]="size" [attr.height]="size" [attr.viewBox]="'0 0 ' + box + ' ' + box">
        <circle
          [attr.cx]="center" [attr.cy]="center" [attr.r]="radius"
          fill="none" stroke="rgba(255,255,255,0.1)" [attr.stroke-width]="strokeWidth"/>
        <circle
          [attr.cx]="center" [attr.cy]="center" [attr.r]="radius"
          fill="none"
          [attr.stroke]="color"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
          stroke-linecap="round"
          [attr.transform]="'rotate(-90 ' + center + ' ' + center + ')'"
          class="ring-progress"
          [style.--circ]="circumference"/>
        <text [attr.x]="center" [attr.y]="center + 5" text-anchor="middle" class="ring-pct">
          {{ pct !== null ? pct + '%' : '—' }}
        </text>
      </svg>
      <div class="ring-text">
        <span class="ring-lbl">{{ label }}</span>
        <span class="ring-detail" *ngIf="detail">{{ detail }}</span>
      </div>
    </div>
  `,
  styles: [`
    .ring-card { display: flex; align-items: center; gap: 14px; }
    .ring-text { display: flex; flex-direction: column; }
    .ring-lbl { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 500; }
    .ring-detail { font-size: 11px; color: rgba(255,255,255,0.45); }
    .ring-pct { font-size: 16px; font-weight: 700; fill: #fff; font-family: 'DM Sans', sans-serif; }
    @keyframes ringFill { from { stroke-dashoffset: var(--circ); } }
    .ring-progress { animation: ringFill 0.9s cubic-bezier(0.4, 0, 0.2, 1); transition: stroke-dashoffset 0.8s ease; }
  `]
})
export class RingGaugeComponent implements OnInit, OnChanges {
  @Input({ required: true }) pct: number | null = null;
  @Input() color = '#25C893';
  @Input() label = '';
  @Input() detail = '';
  @Input() size = 74;

  box = 76;
  strokeWidth = 6;

  get center(): number { return this.box / 2; }
  get radius(): number { return (this.box / 2) - this.strokeWidth - 2; }
  get circumference(): number { return 2 * Math.PI * this.radius; }

  dashOffset = 0;

  ngOnInit(): void {
    // Sin setTimeout: zone.js dispara deteccion de cambios por cada temporizador,
    // y si el *ngFor de arriba recrea estos anillos, cada recreacion programaba
    // uno nuevo. Eso realimentaba la deteccion hasta colgar la pestana. La
    // animacion de entrada ya la hace la keyframe `ringFill` en CSS.
    this.updateOffset();
  }

  ngOnChanges(): void { this.updateOffset(); }

  private updateOffset(): void {
    const value = this.pct ?? 0;
    this.dashOffset = this.circumference * (1 - Math.min(value, 100) / 100);
  }
}