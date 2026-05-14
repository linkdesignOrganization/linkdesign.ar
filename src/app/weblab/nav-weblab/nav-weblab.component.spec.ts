import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavWeblabComponent } from './nav-weblab.component';

describe('NavWeblabComponent', () => {
  let component: NavWeblabComponent;
  let fixture: ComponentFixture<NavWeblabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavWeblabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavWeblabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
