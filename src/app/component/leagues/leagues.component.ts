import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamInLeague } from './leagues.model';
import { Leagues } from '../../services/leagues/leagues';
import { parseSeason } from '../../core/season';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.css'
})
export class LeagueComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private leagueService = inject(Leagues);

  leagueId!: number;
  leagueName    = '';
  leagueType    = '';
  leagueLogo    = '';
  leagueCountry = '';
  currentSeason = 0;

  teams: TeamInLeague[] = [];
  loading = true;

  ngOnInit(): void {
    this.leagueId      = Number(this.route.snapshot.paramMap.get('id'));
    this.leagueName    = this.route.snapshot.queryParamMap.get('name')    ?? '';
    this.leagueLogo    = this.route.snapshot.queryParamMap.get('logo')    ?? '';
    this.leagueType    = this.route.snapshot.queryParamMap.get('type')    ?? '';
    this.leagueCountry = this.route.snapshot.queryParamMap.get('country') ?? '';
    this.currentSeason = parseSeason(this.route.snapshot.queryParamMap.get('season'));

    // ── Conecta tu servicio aquí ──────────────────────────────────────────
    this.leagueService.getTeamsByLeague(this.leagueId, this.currentSeason)
      .subscribe({
        next: (data: any) => {
          // El backend devuelve el array de api-football tal cual; si la cuota
          // se agotó puede llegar vacío o no ser un array.
          this.teams   = Array.isArray(data) ? data : [];
          this.loading = false;
        },
        error: () => this.loading = false,
      });
  }

  // ── Navegar al equipo reutilizando CountryComponent ───────────────────────
  goToTeam(item: TeamInLeague): void {
    this.router.navigate(['/paises'], {
      queryParams: {
        teamId  : item.team.id,
        name    : item.team.name,
        logo    : item.team.logo,
        country : item.team.country,
        founded : item.team.founded,
        code    : item.team.code,
        leagueId: this.leagueId,   // ← para poder volver
        season  : this.currentSeason,  // ← la temporada viaja hasta la ficha
      }
    });
  }

  // ── Volver al país ────────────────────────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/paises']);
  }

  typeLabel(type: string): string {
    return type === 'League' ? 'Liga' : 'Copa';
  }
}