import { TestBed } from '@angular/core/testing';

import { Country } from './country';
import { provideHttpTesting } from '../../testing/test-providers';

describe('Country', () => {
  let service: Country;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideHttpTesting() });
    service = TestBed.inject(Country);
  });

  it('se crea', () => {
    expect(service).toBeTruthy();
  });
});
