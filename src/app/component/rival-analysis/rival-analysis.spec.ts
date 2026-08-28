import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RivalAnalysis } from './rival-analysis';

describe('RivalAnalysis', () => {
  let component: RivalAnalysis;
  let fixture: ComponentFixture<RivalAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RivalAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RivalAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
