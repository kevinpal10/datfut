import { CommonModule } from '@angular/common';import { Component, input, computed } from '@angular/core';
import { Formation, FieldPlayer } from '../../core/match.model';

// ViewBox del campo SVG
const FIELD_W = 260;
const FIELD_H = 360;

@Component({
  selector: 'app-formation-field',
  imports: [
    CommonModule
  ],
  templateUrl: './formation-field.html',
  styleUrl: './formation-field.css',
})
export class FormationField {


  formation = input.required<Formation>();
  teamName  = input.required<string>();

  fieldW = FIELD_W;
  fieldH = FIELD_H;

  playerTransform(player: FieldPlayer): string {
    const x = (player.fieldX / 100) * FIELD_W;
    const y = (player.fieldY / 100) * FIELD_H;
    return `translate(${x}, ${y})`;
  }

  roleColor(role: FieldPlayer['role']): string {
    return {
      gk:  '#FBBF24',   // amarillo
      def: '#FBBF24',   // amarillo
      mid: '#3B82F6',   // azul
      fwd: '#E24B4A',   // rojo
    }[role];
  }

  roleTextColor(role: FieldPlayer['role']): string {
    return role === 'mid' || role === 'fwd' ? '#fff' : '#1a1a1a';
  }

}
