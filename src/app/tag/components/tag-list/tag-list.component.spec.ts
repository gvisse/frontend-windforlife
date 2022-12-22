import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TagListComponent } from './tag-list.component';
import { TagsService } from '../../services/tags.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NewTagComponent } from '../new-tag/new-tag.component';

describe('TagListComponent', () => {

  let component: TagListComponent;
  let fixture: ComponentFixture<TagListComponent>;

  let tagDe: DebugElement;
  let tagEl: HTMLElement;

  let tagsService: TagsService;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [TagListComponent],
      providers: [TagsService, AuthService, JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }],
        schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TagListComponent);
    component = fixture.componentInstance;

    tagDe = fixture.debugElement;
    tagEl = tagDe.nativeElement;

    tagsService = TestBed.inject(TagsService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  it('should delete a tag when onDeleteTag is called', () => {
    const spy = jest.spyOn(tagsService, 'deleteTag');
    const deletedTag = { id: 1 };

    component.onDeleteTag(deletedTag);

    expect(spy).toHaveBeenCalledWith(deletedTag.id);
  });

  it('should create a tag when onCreateTag is called', () => {
    const spy = jest.spyOn(tagsService, 'createTag');
    const createdTag = { name: 'new tag' };

    component.onCreateTag(createdTag);

    expect(spy).toHaveBeenCalledWith(createdTag.name);
  });

  it('should update pagination properties when onChangePage is called', () => {
    const e = {
      length: 100,
      pageSize: 25,
      pageIndex: 2
    };

    component.onChangePage(e);

    expect(component.pageEvent).toEqual(e);
    expect(component.length).toEqual(e.length);
    expect(component.pageIndex).toEqual(e.pageIndex);
    expect(component.pageSize).toEqual(e.pageSize);
  });

  it('should get tags from the server when getTagsFromServer is called and initialize observable', () => {
    const spy = jest.spyOn(tagsService, 'getTagsFromServer');
    jest.spyOn(tagsService, 'tags$', 'get').mockReturnValue(of([]));
    jest.spyOn(tagsService, 'countTags$', 'get').mockReturnValue(of(0));
    jest.spyOn(tagsService, 'loading$', 'get').mockReturnValue(of(false));

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    component.tags$.subscribe(tags => {
      expect(tags).toEqual([]);
    });
    component.countTags$.subscribe(count => {
      expect(count).toEqual(0);
    });
    component.loading$.subscribe(loading => {
      expect(loading).toBeFalsy();
    });

  });

});

