import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomecorporateComponent } from './homecorporate.component';

describe('HomecorporateComponent', () => {
  let component: HomecorporateComponent;
  let fixture: ComponentFixture<HomecorporateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomecorporateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomecorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
