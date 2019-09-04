import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgPerfilPage } from './pg-perfil.page';

describe('PgPerfilPage', () => {
  let component: PgPerfilPage;
  let fixture: ComponentFixture<PgPerfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgPerfilPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
