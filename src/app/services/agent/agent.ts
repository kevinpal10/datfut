import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

/** Contrato de `POST /agent/chat` (SPEC §5.3). */
export interface Ejercicio {
  nombre: string;
  duracion_min: number;
  descripcion: string;
}

export interface Routine {
  posicion: string;
  tiempo_minutos: number;
  minutos_asignados: number;
  ejercicios: Ejercicio[];
}

export interface ChatResponse {
  conversation_id: string;
  agent_response: string;
  /** De dónde salió cada cifra. Vacío = el agente no citó datos. */
  sources: Array<Record<string, unknown>>;
  /** Nullable: si el usuario sólo preguntó, no se fuerza una rutina. */
  routine: Routine | null;
  routine_id: number | null;
  /** `true` cuando no hay modelo y la respuesta es determinista. */
  degraded: boolean;
}

/** Una llamada a herramienta registrada en `agent_runs`. */
export interface ToolCall {
  tool: string;
  input?: Record<string, unknown>;
  latency_ms?: number;
}

/** Fila de `agent_runs` (SPEC 2.2.3). */
export interface AgentRun {
  id: number;
  conversation_id: string;
  created_at: string;
  prompt: string;
  tool_calls: ToolCall[];
  latency_ms: number | null;
  model: string | null;
}

/** Fila de `routines` (SPEC 2.1.6). */
export interface RoutineRow {
  id: number;
  created_at: string;
  player_id: number | null;
  season: number | null;
  posicion: string;
  minutos: number;
  payload: Routine;
}

export interface ChatRequest {
  message: string;
  player_id?: number;
  season?: number;
  conversation_id?: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agent`;

  chat(payload: ChatRequest) {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, payload);
  }

  /** Historial de rutinas generadas (SPEC §2.1.6). */
  routines(playerId?: number) {
    const params: Record<string, number> = playerId ? { player_id: playerId } : {};
    return this.http.get<RoutineRow[]>(`${this.apiUrl}/routines`, { params });
  }

  /** Auditoría de ejecuciones del agente (SPEC §2.2.3). */
  runs(conversationId?: string) {
    const params: Record<string, string> = conversationId
      ? { conversation_id: conversationId }
      : {};
    return this.http.get<AgentRun[]>(`${this.apiUrl}/runs`, { params });
  }
}
