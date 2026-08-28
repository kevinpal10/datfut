import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AgentService, AgentRun, RoutineRow } from '../../services/agent/agent';

/**
 * Auditoría del agente (SPEC §2.2.3): qué herramientas invocó, con qué
 * argumentos y con qué latencia. Es lo que hace verificable la regla de "sin
 * alucinaciones": si una respuesta cita cifras, tiene que haber una llamada a
 * `obtener_metricas_jugador` detrás.
 */
@Component({
  selector: 'app-agent-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-audit.html',
  styleUrl: './agent-audit.css',
})
export class AgentAuditComponent {

  private agent = inject(AgentService);
  private router = inject(Router);

  runs = signal<AgentRun[]>([]);
  routines = signal<RoutineRow[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.agent.runs().subscribe({
      next: datos => {
        this.runs.set(Array.isArray(datos) ? datos : []);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo leer la auditoría del agente.');
        this.cargando.set(false);
      },
    });

    this.agent.routines().subscribe({
      next: datos => this.routines.set(Array.isArray(datos) ? datos : []),
      error: () => this.routines.set([]),
    });
  }

  volver(): void {
    this.router.navigate(['/paises']);
  }

  /** Nombres de herramienta de una ejecución, para el resumen de la fila. */
  herramientas(run: AgentRun): string[] {
    return (run.tool_calls ?? []).map(c => c.tool);
  }

  /** `true` si la ejecución consultó métricas reales antes de responder. */
  consultoMetricas(run: AgentRun): boolean {
    return this.herramientas(run).includes('obtener_metricas_jugador');
  }

  /** Una herramienta servida desde la caché tarda microsegundos: `0 ms`
   *  parece un fallo, cuando en realidad es la mejor noticia posible. */
  latencia(ms: number | null | undefined): string {
    if (ms === null || ms === undefined) { return '—'; }
    return ms === 0 ? '<1 ms' : `${ms} ms`;
  }

  argumentos(call: { tool: string; input?: Record<string, unknown> }): string {
    const input = call.input ?? {};
    const partes = Object.keys(input).map(k => `${k}=${input[k]}`);
    return partes.length ? partes.join(', ') : '—';
  }

  fecha(iso: string): string {
    return (iso ?? '').replace('T', ' ').slice(0, 19);
  }

  /** Colorea la latencia: verde rápido, ámbar medio, rojo lento. */
  claseLatencia(ms: number | null): string {
    if (ms === null || ms === undefined) { return ''; }
    if (ms < 3000) { return 'lat--ok'; }
    if (ms < 15000) { return 'lat--medio'; }
    return 'lat--lento';
  }
}
