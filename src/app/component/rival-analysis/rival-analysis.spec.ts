import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RivalAnalysis } from './rival-analysis';
import { providersDePrueba } from '../../testing/test-providers';
import { ANALISIS_RIVAL } from '../../testing/match-fixtures';

describe('RivalAnalysis', () => {
  let component: RivalAnalysis;
  let fixture: ComponentFixture<RivalAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RivalAnalysis],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(RivalAnalysis);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('analysis', ANALISIS_RIVAL);
    fixture.componentRef.setInput('teamName', 'Argentina');
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('muestra fortalezas y debilidades del rival', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Desborde por bandas');
    expect(texto).toContain('Espalda de los laterales');
  });

});
