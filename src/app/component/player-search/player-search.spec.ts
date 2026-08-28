import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search';
import { providersDePrueba } from '../../testing/test-providers';

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSearchComponent],
      providers: providersDePrueba({}),
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });
});
