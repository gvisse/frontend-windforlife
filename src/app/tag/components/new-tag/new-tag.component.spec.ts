import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NewTagComponent } from './new-tag.component';
import { TagsService } from '../../services/tags.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('NewTagComponent', () => {
  let component: NewTagComponent;
  let fixture: ComponentFixture<NewTagComponent>;

  let newTagDe: DebugElement;
  let newTagEl: HTMLElement;

  let tagsService: TagsService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTagComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ],
      providers: [ TagsService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewTagComponent);
    component = fixture.componentInstance;

    newTagDe = fixture.debugElement;
    newTagEl = newTagDe.nativeElement;

    tagsService = TestBed.inject(TagsService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.tagCtrl.invalid).toBeTruthy();
  });

  it('should have a valid form after inputting a value', () => {
    component.tagCtrl.setValue('test');
    expect(component.tagCtrl.valid).toBeTruthy();
  });

  it('should reset the form after successful submission', () => {
    component.tagCtrl.setValue('test');
    component.onSubmit();
    expect(component.tagCtrl.value).toBe('');
  });

  it('should emit the created tag event on successful submission', () => {
    const createdTagSpy = jest.fn();
    component.createdTag.subscribe(createdTagSpy);

    component.tagCtrl.setValue('test');
    component.onSubmit();

    expect(createdTagSpy).toHaveBeenCalledWith({name: 'test'});
  });

  it('should not emit the created tag event on failed submission', () => {
    const createdTagSpy = jest.fn();
    component.createdTag.subscribe(createdTagSpy);

    component.onSubmit();

    expect(createdTagSpy).not.toHaveBeenCalled();
  });
});
