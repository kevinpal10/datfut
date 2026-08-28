import { Player } from './../../services/player/player';
import { Component, inject, OnInit } from '@angular/core';
import { Country } from '../../services/country/country';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Leagues } from '../../services/leagues/leagues';


@Component({
  selector: 'app-country',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  templateUrl: './country.html',
  styleUrl: './country.css'
})
export class CountryComponent implements OnInit {

  countries: any[] = [];
  players: any[] = [];
  countryInfo: any = null;
  selectedCountry: any;
  selectedCountryComplete: any;
  filteredCountry: any[] = [];
  searchControl = new FormControl('');
  isTeamMode = false;
  activeLeagues: any[] = [];
  private route  = inject(ActivatedRoute);
  

  constructor(
    private countryService: Country,
    private PlayerService: Player,
    private leagueService: Leagues,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Logica en caso de que sea un equipo
    const teamId = this.route.snapshot.queryParamMap.get('teamId');

    if (teamId) {
      this.isTeamMode = true;
      this.countryInfo = {
        id      : Number(teamId),
        name    : this.route.snapshot.queryParamMap.get('name'),
        logo    : this.route.snapshot.queryParamMap.get('logo'),
        country : this.route.snapshot.queryParamMap.get('country'),
        founded : this.route.snapshot.queryParamMap.get('founded'),
        national: false,   // ← oculta campeonatos automáticamente
        code    : this.route.snapshot.queryParamMap.get('code'),
      };
      this.getPlayersByCountry(Number(teamId));
      return;
    }

    // Obtener equipos y filtrar por nombre único
    this.countryService.getCountries().subscribe((data: any) => {
      this.countries = data
        .filter((league: any, index: number, self: any[]) =>
          index === self.findIndex((l: any) => l.name === league.name)
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      // ✅ Inicializar con todos los países ya limpios
      this.filteredCountry = [...this.countries];
    });

    // Filtro del buscador
    this.searchControl.valueChanges.subscribe(value => {
      const search = (value || '').toLowerCase();

      // ✅ Si está vacío muestra todos
      if (!search) {
        this.filteredCountry = [...this.countries];
        return;
      }

      this.filteredCountry = this.countries.filter((country: any) =>
        country.name.toLowerCase().includes(search)
      );
    });

  }

  // ── displayWith para mat-autocomplete ─────────────────────────────────────
  displayCountry(value: string): string {
    return value ?? '';
  }

  // ── Obtener jugadores del país seleccionado ────────────────────────────────
  getPlayersByCountry(idCountry: number) {
    this.PlayerService.getPlayerByCountry(idCountry).subscribe((data: any) =>
      this.players = data[0].players
    );
  }

    // ── Obtener jugadores del país seleccionado ────────────────────────────────
  getLeaguesHasPlayedCountry(idCountry: number) {
    // this.PlayerService.getPlayerByCountry(idCountry).subscribe((data: any) =>
    //   this.players = data[0].players
    // );
  }

  // ── Obtener información del país seleccionado ──────────────────────────────
  getInfoCountry(countryName: string) {
    this.countryService.getInfoCountry(countryName).subscribe((data: any) => {
      this.countryInfo = data[0].team;
      this.getLeaguesHasPlayedCountry(data[0].team.id);
      this.getPlayersByCountry(data[0].team.id);
    });
  }


  // ── Navegar a campeonato ──────────────────────────────────────────────────
  goToLeague(league: any): void {
    this.router.navigate(['/campeonato', league.id], {
      queryParams: {
        name   : league.name,
        logo   : league.logo,
        type   : league.type,
        country: this.countryInfo?.country ?? '',
        season : league.currentSeason,
      }
    });
  }

  // ── Manejar selección de un país ───────────────────────────────────────────
  onCountrySelected(event: any) {
    this.selectedCountry = event.option.value;
    this.selectedCountryComplete = this.countries.find(
      (country: any) => country.name === this.selectedCountry
    );
    this.getInfoCountry(this.selectedCountryComplete.name);
    this.getLeaguesByCountry(this.selectedCountryComplete.name);
  }

  // ── Estadísticas de un jugador ─────────────────────────────────────────────
  getPlayerStats(playerId: number) {
    console.log(`Cargando stats del jugador ${playerId} para la temporada 2024 en component country...`);
    this.router.navigate(['/jugador', playerId], {
      queryParams: { season: 2026 } 
    });
  }

  goBack(): void {
    this.router.navigate(['/campeonato', this.route.snapshot.queryParamMap.get('leagueId')]);
  }

  // ── Helpers para la tabla ──────────────────────────────────────────────────
  countByPosition(position: string): number {
    return this.players.filter(p => p.position === position).length;
  }

  //  ── Obtener ligas activas del país seleccionado ─────────────────────────────
  getLeaguesByCountry(countryName: string): void {
    this.leagueService.getLiguesByCountry(countryName).subscribe((data: any) => {
      this.activeLeagues = (data as any[])
        .filter(item => item.seasons.some((s: any) => s.current === true))
        .map(item => ({
          id:            item.league.id,
          name:          item.league.name,
          type:          item.league.type,
          logo:          item.league.logo,
          currentSeason: item.seasons.find((s: any) => s.current)?.year,
        }));
    });
  }

  positionClass(position: string): string {
    const map: Record<string, string> = {
      'Goalkeeper': 'badge-green',
      'Defender':   'badge-blue',
      'Midfielder': 'badge-amber',
      'Attacker':   'badge-red',
    };
    return map[position] ?? 'badge-gray';
  }

  positionLabel(position: string): string {
    const map: Record<string, string> = {
      'Goalkeeper': 'Portero',
      'Defender':   'Defensa',
      'Midfielder': 'Mediocampista',
      'Attacker':   'Delantero',
    };
    return map[position] ?? position;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}