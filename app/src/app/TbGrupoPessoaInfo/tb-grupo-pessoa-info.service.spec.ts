import { TestBed } from '@angular/core/testing';

import { TbGrupoPessoaInfoService } from './tb-grupo-pessoa-info.service';

describe('TbGrupoPessoaInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbGrupoPessoaInfoService = TestBed.get(TbGrupoPessoaInfoService);
    expect(service).toBeTruthy();
  });
});
