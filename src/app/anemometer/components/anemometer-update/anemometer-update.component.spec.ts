import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AnemometersService } from '../../services/anemometers.service';
import { TagsService } from '../../../tag/services/tags.service';

import { AnemometerUpdateComponent } from './anemometer-update.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnemometerListComponent } from '../anemometer-list/anemometer-list.component';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { Tag } from '../../../tag/models/tag.model';
import { Anemometer } from '../../models/anemometer.model';
import { MatChipInputEvent } from '@angular/material/chips';

describe('AnemometerUpdateComponent', () => {
  let component: AnemometerUpdateComponent;
  let fixture: ComponentFixture<AnemometerUpdateComponent>;

  let anemoService: AnemometersService;
  let tagService: TagsService;
  let http: HttpTestingController;
  let router: Router;

  let mockTags: Tag[];
  let mockTags$: Observable<Tag[]>;
  let mockAnemo: Anemometer;
  let mockAnemo$: Observable<Anemometer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {path: 'anemometer', component: AnemometerListComponent}
        ])
      ],
      declarations: [ AnemometerUpdateComponent ],
      providers: [
        FormBuilder,
        { provide: TagsService, useValue: {
          allTags$: jest.fn().mockReturnValue(mockTags$),
          getAllTags: jest.fn()
        }
      },
      { provide: AnemometersService, useValue: {
          loading$: of(false),
          getAnemometerById: jest.fn().mockReturnValue(mockAnemo$),
					updateAnemometer: jest.fn()
        }
      },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnemometerUpdateComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    anemoService = TestBed.inject(AnemometersService);
    tagService = TestBed.inject(TagsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockTags = [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }];
    mockTags$ = of(mockTags);
    mockAnemo = { id: 1, name: 'anemometer1', latitude: '0', longitude: '0', altitude: 0, tags: [{ id: 1, name: 'tag1' },]};
    mockAnemo$ = of(mockAnemo);
		component.allTags$ = mockTags$;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should initialize observables', () => {
      jest.spyOn(anemoService, 'getAnemometerById');
      expect(anemoService.getAnemometerById).toHaveBeenCalled();
      expect(component.loading$).toBe(anemoService.loading$);
    });
  
    it('should initialize the form', () => {
      expect(component.anemometerForm).toBeInstanceOf(FormGroup);
      expect(component.anemometerForm.controls['name']).toBeInstanceOf(FormControl);
      expect(component.anemometerForm.controls['latitude']).toBeInstanceOf(FormControl);
      expect(component.anemometerForm.controls['longitude']).toBeInstanceOf(FormControl);
      expect(component.anemometerForm.controls['altitude']).toBeInstanceOf(FormControl);
      expect(component.anemometerForm.controls['tags']).toBeInstanceOf(FormControl);
    });
  
    it('should set the form with the appropriate data', () => {
      expect(component.anemometerForm.controls['name'].value).toEqual(mockAnemo.name);
      expect(component.anemometerForm.controls['latitude'].value).toEqual(mockAnemo.latitude);
      expect(component.anemometerForm.controls['longitude'].value).toEqual(mockAnemo.longitude);
      expect(component.anemometerForm.controls['altitude'].value).toEqual(mockAnemo.altitude);
      expect(component.chipSelectedTags).toEqual(mockAnemo.tags);
    });

		it('should return an error message when getFormControlErrorText is called with an error', () => {
			let ctrl = { hasError: (error: string) => error === 'minlength', errors: { minlength : { requiredLength: 5 }}};
			let errorText = component.getFormControlErrorText(ctrl as any);
			expect(errorText).toBe('Le nom n\'est pas assez long (min: 5)');
		});

  });

	describe('add a tag from input text', () => {

		function addATag(name: string, opened: boolean, freeText: boolean){
			component.allowFreeTextAddTag = freeText;
			component.matAutocomplete = { isOpen : opened } as unknown as MatAutocomplete;
			component.add({
				input: null, value: name,
				chipInput: {clear: () => {}}
			} as unknown as MatChipInputEvent);
		}

		it('should add a tag that exist if autocomplete list is not open', () => {
			addATag('tag2', false, true);
			expect(component.chipSelectedTags).toEqual(mockTags);
		});

		it('should add a tag that not exist if autocomplete list is not open', () => {
			addATag('new tag', false, true);
			expect(component.chipSelectedTags).toEqual([{id: 1, name: 'tag1'}, {id : 3, name: 'new tag'}]);
		});

		it('should not add a tag with an empty name', () => {
			addATag('', false, true);
			expect(component.chipSelectedTags).toEqual([{id: 1, name: 'tag1'}]);
		});

		it('should not add, only allowed to select from the filtered autocomplete list', () =>{
			addATag('new tag', false, false);
			expect(component.chipSelectedTags).toEqual([{id: 1, name: 'tag1'}]);
		});

		it('should not add, if autocomplete list is open', () =>{
			addATag('new tag', true, true);
			expect(component.chipSelectedTags).toEqual([{id: 1, name: 'tag1'}]);
		});

	});

  it('should filter tag', fakeAsync(() => {
		let filtered: string[] = [];
    component.filteredTags$.subscribe(tags$ => tags$.subscribe(
			tags => filtered = tags
		));
		component.tagControl.setValue('tag2');
    expect(filtered).toStrictEqual(['tag2'])
  }));

  it('should remove a tag from the chipSelectedTags array', () => {
    component.chipSelectedTags = [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }];
		jest.spyOn(component.chipSelectedTags, 'indexOf').mockReturnValue(0);
    component.removeTag({ id: 1, name: 'tag1' });
    expect(JSON.stringify(component.chipSelectedTags)).toBe(JSON.stringify([{ id: 2, name: 'tag2' }]));
  });

	it('should select a tag and reset the inputs', () => {
		const mockEvent = {
			option: {
				viewValue: 'tag2'
			}
		} as MatAutocompleteSelectedEvent;
		let tagInput = document.createElement('input');
		tagInput.type = 'text'
		component.tagInput = {nativeElement: tagInput} as ElementRef;
		component.tagSelected(mockEvent);
	
		expect(component.chipSelectedTags).toStrictEqual([{id: 1, name: 'tag1'}, {id: 2, name: 'tag2'}])
		expect(component.tagInput.nativeElement.value).toBe('');
	});

	it('should set the current step to the specified value', () => {
		component.setStep(2);
		expect(component.step).toEqual(2);
	});

	it('should move to the previous step in the form', () => {
		component.step = 2;
		component.prevStep();
		expect(component.step).toBe(1);
	});

	it('should move to the next step in the form', () => {
		component.step = 1;
		component.nextStep();
		expect(component.step).toBe(2);
	});

	describe('submit method', () => {
		it('should update the anemometer', () => {
			jest.spyOn(anemoService, 'updateAnemometer')
			component.onSubmit();
			expect(component.anemometerForm.valid).toBeTruthy();
			expect(anemoService.updateAnemometer).toHaveBeenCalled();
		});

		it('should update the anemometer', () => {
			jest.spyOn(anemoService, 'updateAnemometer')
			component.anemometerForm.controls['name'].setValue('test');
			component.onSubmit();
			expect(component.anemometerForm.invalid).toBeTruthy();
			expect(anemoService.updateAnemometer).toHaveBeenCalledTimes(0);
		});

	});
});
