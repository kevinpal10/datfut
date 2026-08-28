import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamInfo } from '../../core/match.model';

@Component({
  selector: 'app-match-header',
  imports: [
    CommonModule
  ],
  templateUrl: './match-header.html',
  styleUrl: './match-header.css',
})
export class MatchHeader {

  homeTeam   = input.required<TeamInfo>();
  awayTeam   = input.required<TeamInfo>();
  competition = input.required<string>();
  phase       = input.required<string>();
  scheme      = input<string>('5-4-1');

}
