import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueComponent } from './leagues.component';
import { providersDePrueba } from '../../testing/test-providers';

describe('LeagueComponent', () => {
  let component: LeagueComponent;
  let fixture: ComponentFixture<LeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueComponent],
      providers: providersDePrueba({ params: { id: '39' }, queryParams: { season: '2024' } }),
    }).compileComponents();

    fixture = TestBed.createComponent(LeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });
});
