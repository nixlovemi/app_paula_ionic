import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgGaleriaImagemPage } from './pg-galeria-imagem.page';

describe('PgGaleriaImagemPage', () => {
  let component: PgGaleriaImagemPage;
  let fixture: ComponentFixture<PgGaleriaImagemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgGaleriaImagemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgGaleriaImagemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
