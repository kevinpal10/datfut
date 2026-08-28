import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHeader } from './match-header';

describe('MatchHeader', () => {
  let component: MatchHeader;
  let fixture: ComponentFixture<MatchHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
