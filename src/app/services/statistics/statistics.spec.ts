import { TestBed } from '@angular/core/testing';

import { Statistics } from './statistics';
import { provideHttpTesting } from '../../testing/test-providers';

describe('Statistics', () => {
  let service: Statistics;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideHttpTesting() });
    service = TestBed.inject(Statistics);
  });

  it('se crea', () => {
    expect(service).toBeTruthy();
  });
});
