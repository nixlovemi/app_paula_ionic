import { TestBed } from '@angular/core/testing';

import { TbGrupoPessoaService } from './tb-grupo-pessoa.service';

describe('TbGrupoPessoaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbGrupoPessoaService = TestBed.get(TbGrupoPessoaService);
    expect(service).toBeTruthy();
  });
});
