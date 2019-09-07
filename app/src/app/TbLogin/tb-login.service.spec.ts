import { TestBed } from '@angular/core/testing';

import { TbLoginService } from './tb-login.service';

describe('TbLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbLoginService = TestBed.get(TbLoginService);
    expect(service).toBeTruthy();
  });
});
