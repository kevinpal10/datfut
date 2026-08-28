import { TestBed } from '@angular/core/testing';

import { Player } from './player';
import { provideHttpTesting } from '../../testing/test-providers';

describe('Player', () => {
  let service: Player;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideHttpTesting() });
    service = TestBed.inject(Player);
  });

  it('se crea', () => {
    expect(service).toBeTruthy();
  });
});
