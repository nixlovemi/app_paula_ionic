import { TestBed } from '@angular/core/testing';

import { TbGrupoTimelineService } from './tb-grupo-timeline.service';

describe('TbGrupoTimelineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbGrupoTimelineService = TestBed.get(TbGrupoTimelineService);
    expect(service).toBeTruthy();
  });
});
