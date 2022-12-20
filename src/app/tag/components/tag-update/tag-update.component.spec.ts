import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { TagUpdateComponent } from './tag-update.component';
import { Tag } from '../../models/tag.model';
import { TagsService } from '../../services/tags.service';
import { Observable, of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TagListComponent } from '../tag-list/tag-list.component';

describe('TagUpdateComponent', () => {
  let component: TagUpdateComponent;
  let fixture: ComponentFixture<TagUpdateComponent>;

  let tagDe: DebugElement;
  let tagEl: HTMLElement;

  let tagsService: TagsService;
  let mockTag: Tag;
  let mockTag$: Observable<Tag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'tag', component: TagListComponent}
        ])
      ],
      declarations: [
        TagUpdateComponent
      ],
      providers: [
        FormBuilder,
        {
          provide: TagsService,
          useValue: {
            getTagById: jest.fn().mockReturnValue(mockTag$),
            updateTag: jest.fn(),
            goToPage: jest.fn()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TagUpdateComponent);
    component = fixture.componentInstance;
    tagDe = fixture.debugElement;
    tagEl = tagDe.nativeElement;
    tagsService = TestBed.inject(TagsService);

    fixture.detectChanges();
  });

  beforeEach(() => {
    mockTag = { id: 1, name: 'test' };
    mockTag$ = of(mockTag);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and observables on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tagCtrl).toBeDefined();
    expect(component.tag$).toBeDefined();
    tagsService.getTagById(1).subscribe(tag =>{
      expect(tag).toEqual(mockTag);
    });
  });

  it('should call updateTag and goToPage on submit', () => {
    component.tagCtrl = { invalid: false, value: 'test' } as any;
    component.onSubmit();
    expect(tagsService.updateTag).toHaveBeenCalledWith(1, 'test');
    expect(tagsService.goToPage).toHaveBeenCalledWith({page: 1, size: 10});
  });

  it('should not call updateTag and goToPage on submit if form is invalid', () => {
    component.tagCtrl = { invalid: true } as any;
    component.onSubmit();
    expect(tagsService.updateTag).not.toHaveBeenCalled();
    expect(tagsService.goToPage).not.toHaveBeenCalled();
  });
});