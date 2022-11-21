import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnemometerNewComponent } from './anemometer-new.component';

describe('AnemometerNewComponent', () => {
  let component: AnemometerNewComponent;
  let fixture: ComponentFixture<AnemometerNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnemometerNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
