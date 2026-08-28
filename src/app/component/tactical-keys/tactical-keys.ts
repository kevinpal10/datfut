import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TacticalKey } from '../../core/match.model';

@Component({
  selector: 'app-tactical-keys',
  imports: [
    CommonModule
  ],
  templateUrl: './tactical-keys.html',
  styleUrl: './tactical-keys.css',
})
export class TacticalKeys {

  keys = input.required<TacticalKey[]>();

  typeIcon(type: TacticalKey['type']): string {
    return { attack: '⚡', defense: '🛡️', setpiece: '🎯', pressing: '🔃' }[type];
  }


}
