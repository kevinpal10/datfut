import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { CoachChatComponent } from './coach-chat';
import { providersDePrueba } from '../../testing/test-providers';
import { environment } from '../../environments/environment';

describe('CoachChatComponent', () => {
  let component: CoachChatComponent;
  let fixture: ComponentFixture<CoachChatComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoachChatComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(CoachChatComponent);
    component = fixture.componentInstance;
    component.playerId = 184;
    component.season = 2024;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('envía el jugador y la temporada como contexto de la petición', () => {
    component.borrador = 'Tengo 20 minutos';
    component.enviar();

    const peticion = http.expectOne(`${environment.apiUrl}/agent/chat`);
    expect(peticion.request.body.player_id).toBe(184);
    expect(peticion.request.body.season).toBe(2024);
    peticion.flush({
      conversation_id: 'c-1', agent_response: 'ok',
      sources: [], routine: null, routine_id: null, degraded: true,
    });
  });

  it('no envía nada si el mensaje está vacío', () => {
    component.borrador = '   ';
    component.enviar();
    http.expectNone(`${environment.apiUrl}/agent/chat`);
    expect(component.turnos().length).toBe(0);
  });

  it('arma el temporizador con los minutos que asignó el backend', () => {
    component.borrador = 'rutina de 20 minutos';
    component.enviar();

    http.expectOne(`${environment.apiUrl}/agent/chat`).flush({
      conversation_id: 'c-1',
      agent_response: 'Aquí tienes',
      sources: [{ tool: 'sugerir_entrenamiento' }],
      routine: {
        posicion: 'delantero', tiempo_minutos: 20, minutos_asignados: 20,
        ejercicios: [{ nombre: 'Definición', duracion_min: 20, descripcion: '...' }],
      },
      routine_id: 7,
      degraded: false,
    });

    expect(component.segundosRestantes()).toBe(20 * 60);
    expect(component.reloj).toBe('20:00');
    expect(component.corriendo()).toBeFalse();
  });

  it('reinicia el reloj al valor original de la rutina', () => {
    component.borrador = 'rutina';
    component.enviar();
    http.expectOne(`${environment.apiUrl}/agent/chat`).flush({
      conversation_id: 'c-1', agent_response: '', sources: [],
      routine: {
        posicion: 'portero', tiempo_minutos: 15, minutos_asignados: 15,
        ejercicios: [{ nombre: 'Blocaje', duracion_min: 15, descripcion: '...' }],
      },
      routine_id: null, degraded: true,
    });

    component.segundosRestantes.set(10);
    component.reiniciar();
    expect(component.segundosRestantes()).toBe(15 * 60);
  });

  it('avisa al usuario si el backend falla', () => {
    component.borrador = 'hola';
    component.enviar();
    http.expectOne(`${environment.apiUrl}/agent/chat`)
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(component.error()).toContain('No se pudo contactar');
    expect(component.enviando()).toBeFalse();
  });
});
