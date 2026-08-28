import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticalKeys } from './tactical-keys';
import { providersDePrueba } from '../../testing/test-providers';
import { CLAVES_TACTICAS } from '../../testing/match-fixtures';

describe('TacticalKeys', () => {
  let component: TacticalKeys;
  let fixture: ComponentFixture<TacticalKeys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacticalKeys],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(TacticalKeys);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('keys', CLAVES_TACTICAS);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('pinta una clave por elemento recibido', () => {
    expect(fixture.nativeElement.textContent).toContain('Bloque bajo');
    expect(fixture.nativeElement.textContent).toContain('Balon parado'.replace('Balon', 'Balón'));
  });

});
