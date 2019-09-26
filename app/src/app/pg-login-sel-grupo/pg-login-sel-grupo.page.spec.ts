import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgLoginSelGrupoPage } from './pg-login-sel-grupo.page';

describe('PgLoginSelGrupoPage', () => {
  let component: PgLoginSelGrupoPage;
  let fixture: ComponentFixture<PgLoginSelGrupoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgLoginSelGrupoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgLoginSelGrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
