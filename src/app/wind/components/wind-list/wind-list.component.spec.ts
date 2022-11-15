import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindListComponent } from './wind-list.component';

describe('WindListComponent', () => {
  let component: WindListComponent;
  let fixture: ComponentFixture<WindListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
