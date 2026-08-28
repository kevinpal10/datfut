import { TestBed } from '@angular/core/testing';

import { Leagues } from './leagues';
import { provideHttpTesting } from '../../testing/test-providers';

describe('Leagues', () => {
  let service: Leagues;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideHttpTesting() });
    service = TestBed.inject(Leagues);
  });

  it('se crea', () => {
    expect(service).toBeTruthy();
  });
});
