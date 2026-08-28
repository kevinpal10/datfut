import { Component, DestroyRef, Input, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgentService, ChatResponse, Routine } from '../../services/agent/agent';
import { DEFAULT_SEASON } from '../../core/season';

interface Turno {
  autor: 'usuario' | 'entrenador';
  texto: string;
  /** Presente sólo en turnos del entrenador que citaron datos. */
  fuentes?: Array<Record<string, unknown>>;
  degradado?: boolean;
}

@Component({
  selector: 'app-coach-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coach-chat.html',
  styleUrl: './coach-chat.css',
})
export class CoachChatComponent implements OnDestroy {

  /** Contexto de la ficha abierta: viaja con cada petición (SPEC §4.2.2). */
  @Input({ required: true }) playerId!: number;
  @Input() season: number = DEFAULT_SEASON;
  @Input() playerName = '';

  private agent = inject(AgentService);

  abierto = signal(false);
  enviando = signal(false);
  error = signal<string | null>(null);
  turnos = signal<Turno[]>([]);
  rutina = signal<Routine | null>(null);
  borrador = '';

  private conversationId: string | null = null;

  // ── Temporizador de la rutina ───────────────────────────────────────────
  segundosRestantes = signal(0);
  corriendo = signal(false);
  private intervalo: ReturnType<typeof setInterval> | null = null;

  readonly sugerencias = [
    'Quiero mejorar mi definición y tengo 30 minutos.',
    '¿En qué destaca este jugador esta temporada?',
    'Dame una rutina de 20 minutos para mi posición.',
  ];

  alternar(): void {
    this.abierto.update(v => !v);
  }

  usarSugerencia(texto: string): void {
    this.borrador = texto;
  }

  enviar(): void {
    const mensaje = this.borrador.trim();
    if (!mensaje || this.enviando()) { return; }

    this.turnos.update(t => [...t, { autor: 'usuario', texto: mensaje }]);
    this.borrador = '';
    this.enviando.set(true);
    this.error.set(null);

    this.agent.chat({
      message: mensaje,
      player_id: this.playerId,
      season: this.season,
      conversation_id: this.conversationId ?? undefined,
    }).subscribe({
      next: (respuesta: ChatResponse) => {
        this.conversationId = respuesta.conversation_id;
        this.turnos.update(t => [...t, {
          autor: 'entrenador',
          texto: respuesta.agent_response,
          fuentes: respuesta.sources,
          degradado: respuesta.degraded,
        }]);
        if (respuesta.routine) {
          this.rutina.set(respuesta.routine);
          this.prepararTemporizador(respuesta.routine);
        }
        this.enviando.set(false);
      },
      error: () => {
        this.error.set('No se pudo contactar con el entrenador. Inténtalo de nuevo.');
        this.enviando.set(false);
      },
    });
  }

  // ── Temporizador ────────────────────────────────────────────────────────

  private prepararTemporizador(rutina: Routine): void {
    this.detener();
    this.segundosRestantes.set(rutina.minutos_asignados * 60);
  }

  iniciar(): void {
    if (this.corriendo() || this.segundosRestantes() <= 0) { return; }
    this.corriendo.set(true);
    this.intervalo = setInterval(() => {
      const restante = this.segundosRestantes() - 1;
      this.segundosRestantes.set(Math.max(restante, 0));
      if (restante <= 0) { this.detener(); }
    }, 1000);
  }

  detener(): void {
    if (this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
    this.corriendo.set(false);
  }

  reiniciar(): void {
    const rutina = this.rutina();
    if (rutina) { this.prepararTemporizador(rutina); }
  }

  get reloj(): string {
    const total = this.segundosRestantes();
    const min = Math.floor(total / 60).toString().padStart(2, '0');
    const seg = (total % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  }

  ngOnDestroy(): void {
    this.detener();
  }
}
