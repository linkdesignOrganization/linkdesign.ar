import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeweblabComponent } from './homeweblab.component';

describe('HomeweblabComponent', () => {
  let component: HomeweblabComponent;
  let fixture: ComponentFixture<HomeweblabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeweblabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeweblabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
