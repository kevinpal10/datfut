import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingGauge } from './ring-gauge';

describe('RingGauge', () => {
  let component: RingGauge;
  let fixture: ComponentFixture<RingGauge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RingGauge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RingGauge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
