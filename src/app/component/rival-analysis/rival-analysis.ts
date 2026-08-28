import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RivalAnalysisInterface, MatchResult, AnalysisPoint } from '../../core/match.model';

@Component({
  selector: 'app-rival-analysis',
  imports: [
    CommonModule
  ],
  templateUrl: './rival-analysis.html',
  styleUrl: './rival-analysis.css',
})

export class RivalAnalysis {

  analysis = input.required<RivalAnalysisInterface>();
  teamName = input.required<string>();

  resultClass(result: MatchResult): string {
    return { W: 'tag tag-w', D: 'tag tag-d', L: 'tag tag-l' }[result];
  }

  severityColor(severity: 'high' | 'medium' | 'low', type: 'strength' | 'weakness'): string {
    if (type === 'strength') return '#1D9E75';
    return { high: '#E24B4A', medium: '#EF9F27', low: '#888' }[severity];
  }


}
