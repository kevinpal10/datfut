import { TestBed } from '@angular/core/testing';

import { TeamService } from './team.service';
import { provideHttpTesting } from '../testing/test-providers';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideHttpTesting() });
    service = TestBed.inject(TeamService);
  });

  it('se crea', () => {
    expect(service).toBeTruthy();
  });
});
