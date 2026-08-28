import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryComponent } from './country';
import { providersDePrueba } from '../../testing/test-providers';

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryComponent],
      providers: providersDePrueba({}),
    }).compileComponents();

    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });
});
