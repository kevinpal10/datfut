import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingGaugeComponent } from './ring-gauge';
import { providersDePrueba } from '../../testing/test-providers';

describe('RingGaugeComponent', () => {
  let component: RingGaugeComponent;
  let fixture: ComponentFixture<RingGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RingGaugeComponent],
      providers: providersDePrueba({}),
    }).compileComponents();

    fixture = TestBed.createComponent(RingGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });
});
