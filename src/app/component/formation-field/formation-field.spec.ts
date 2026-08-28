import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationField } from './formation-field';

describe('FormationField', () => {
  let component: FormationField;
  let fixture: ComponentFixture<FormationField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
