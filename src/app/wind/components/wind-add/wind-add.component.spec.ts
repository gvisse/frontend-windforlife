import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindAddComponent } from './wind-add.component';

describe('WindAddComponent', () => {
  let component: WindAddComponent;
  let fixture: ComponentFixture<WindAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
