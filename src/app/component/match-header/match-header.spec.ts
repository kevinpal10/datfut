import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHeader } from './match-header';
import { providersDePrueba } from '../../testing/test-providers';
import { EQUIPO_LOCAL, EQUIPO_VISITANTE } from '../../testing/match-fixtures';

describe('MatchHeader', () => {
  let component: MatchHeader;
  let fixture: ComponentFixture<MatchHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchHeader],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(MatchHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('homeTeam', EQUIPO_LOCAL);
    fixture.componentRef.setInput('awayTeam', EQUIPO_VISITANTE);
    fixture.componentRef.setInput('competition', 'Mundial 2026');
    fixture.componentRef.setInput('phase', 'Fase de grupos');
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra los dos equipos del enfrentamiento', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Argentina');
    expect(texto).toContain('Ecuador');
  });

});
