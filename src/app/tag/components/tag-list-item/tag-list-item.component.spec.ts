import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tag } from '../../models/tag.model';

import { TagListItemComponent } from './tag-list-item.component';

describe('TagListItemComponent', () => {
  let component: TagListItemComponent;
  let fixture: ComponentFixture<TagListItemComponent>;

  let tagDe : DebugElement;
  let tagEl: HTMLElement;

  let expectedTag : Tag;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagListItemComponent);
    component = fixture.componentInstance;

    tagDe = fixture.debugElement;
    tagEl = tagDe.nativeElement;

    expectedTag = {id: 42, name: 'Response', anemos__count: 8}

    component.tag = expectedTag;
    component.canChange = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tag name', () => {
    const expectedTagName = expectedTag.name;
    expect(tagEl.textContent).toContain(expectedTagName);
  });

  it('should render nb anemometer on tag', () =>{
    const expectedNbAnemoTag = expectedTag.anemos__count;
    expect(tagEl.textContent).toContain(`${expectedNbAnemoTag}`);
  });

  it('should render update button', ()=>{
    expect(tagEl.querySelector('a:not(.tag-name)')).toBeTruthy();
  });

  it('should render delete button', ()=>{
    expect(tagEl.querySelector('button')).toBeTruthy();
  });

  it('should not render update button', ()=>{
    component.canChange = false;
    fixture.detectChanges();
    expect(tagEl.querySelector('a:not(.tag-name)')).toBeFalsy();
  });

  it('should not render delete button', ()=>{
    component.canChange = false;
    fixture.detectChanges();
    expect(tagEl.querySelector('button')).toBeFalsy();
  });
});
