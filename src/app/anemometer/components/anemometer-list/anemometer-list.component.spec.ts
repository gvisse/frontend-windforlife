import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnemometerListComponent } from './anemometer-list.component';

describe('AnemometerListComponent', () => {
  let component: AnemometerListComponent;
  let fixture: ComponentFixture<AnemometerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnemometerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
