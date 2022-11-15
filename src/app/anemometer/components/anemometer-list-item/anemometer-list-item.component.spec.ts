import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnemometerListItemComponent } from './anemometer-list-item.component';

describe('AnemometerListItemComponent', () => {
  let component: AnemometerListItemComponent;
  let fixture: ComponentFixture<AnemometerListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnemometerListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
