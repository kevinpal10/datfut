import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticalKeys } from './tactical-keys';

describe('TacticalKeys', () => {
  let component: TacticalKeys;
  let fixture: ComponentFixture<TacticalKeys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacticalKeys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacticalKeys);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
