import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationField } from './formation-field';
import { providersDePrueba } from '../../testing/test-providers';
import { FORMACION } from '../../testing/match-fixtures';

describe('FormationField', () => {
  let component: FormationField;
  let fixture: ComponentFixture<FormationField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationField],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(FormationField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formation', FORMACION);
    fixture.componentRef.setInput('teamName', 'Ecuador');
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('coloca a los once sobre el campo', () => {
    expect(fixture.nativeElement.textContent).toContain('5-4-1');
  });

});
