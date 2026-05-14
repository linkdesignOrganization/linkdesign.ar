import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplithomeComponent } from './splithome.component';

describe('SplithomeComponent', () => {
  let component: SplithomeComponent;
  let fixture: ComponentFixture<SplithomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplithomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplithomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
