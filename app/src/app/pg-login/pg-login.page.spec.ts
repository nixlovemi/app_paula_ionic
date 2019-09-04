import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgLoginPage } from './pg-login.page';

describe('PgLoginPage', () => {
  let component: PgLoginPage;
  let fixture: ComponentFixture<PgLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
