import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindListItemComponent } from './wind-list-item.component';

describe('WindListItemComponent', () => {
  let component: WindListItemComponent;
  let fixture: ComponentFixture<WindListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
