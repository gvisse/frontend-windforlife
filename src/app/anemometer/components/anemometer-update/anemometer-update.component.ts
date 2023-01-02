import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, switchMap, take, tap } from 'rxjs';
import { Tag } from '../../../tag/models/tag.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagsService } from '../../../tag/services/tags.service';
import { AnemometersService } from '../../services/anemometers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Anemometer } from '../../models/anemometer.model';

@Component({
  selector: 'app-anemometer-update',
  templateUrl: './anemometer-update.component.html',
  styleUrls: ['./anemometer-update.component.scss']
})
export class AnemometerUpdateComponent implements OnInit {

  anemometerForm!: FormGroup;
  
  chipSelectedTags: Tag[] = [];
  
  allTags$!: Observable<Tag[]>;
  filteredTags$!: Observable<Observable<string[]>>;
  anemometer$!: Observable<Anemometer>;
  loading$!: Observable<boolean>;

  //
  // Set this to false to ensure Tags are from allTags list only.
  // Set this to true to also allow 'free text' Tags.
  //
  private allowFreeTextAddTag = true;

  tagControl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  step = 0;
  
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  constructor(private fb: FormBuilder,
              private tagsService: TagsService,
              private anemometersService: AnemometersService,
              private route: ActivatedRoute,
              private router: Router)
  {
  }

  get tags(){
    return this.anemometerForm.get('tags');
  }

  ngOnInit() {
    this.initObservables();
    this.tagsService.getAllTags();
    this.initForm();
  }
  
  private initObservables(){
    this.anemometer$ = this.route.params.pipe(
      switchMap(params => this.anemometersService.getAnemometerById(+params['id']))
    );
    this.loading$ = this.anemometersService.loading$;
    this.allTags$ = this.tagsService.allTags$;
    this.filteredTags$ = this.tagControl.valueChanges.pipe(
      startWith(null),
      map((tagName: string | null) => (
        tagName ? this._filter(tagName) : 
          this.allTags$.pipe(
            map(tags => tags.map(tag => tag.name)),
            tap(data => {return data})
          )
        )
      ),
    );
  }

  private initForm(){
    this.anemometerForm = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(5)]],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      altitude: ['', [Validators.required, Validators.min(-434), Validators.max(8849)]],
      tags: this.tagControl
    });
    this.setForm();
  }

  private setForm(){
    this.anemometer$.subscribe(anemometer => {
      this.anemometerForm.controls['name'].setValue(anemometer.name);
      this.anemometerForm.controls['latitude'].setValue(anemometer.latitude);
      this.anemometerForm.controls['latitude'].disable();
      this.anemometerForm.controls['longitude'].setValue(anemometer.longitude);
      this.anemometerForm.controls['longitude'].disable();
      this.anemometerForm.controls['altitude'].setValue(anemometer.altitude);
      this.anemometerForm.controls['altitude'].disable();
      if(anemometer.tags) this.chipSelectedTags = anemometer.tags;      
    })
  }

  private _filter(value: string): Observable<string[]>{
    const filterValue = value.toLowerCase();
    return this.allTags$.pipe(
      map(tags => tags.filter(tag => tag.name.toLowerCase().includes(filterValue))),
      map(tags => tags.map(tag => tag.name))
    );
  }

  private selectTagByName(tagName:string) {
    let foundTag: Tag[] = [];
    this.allTags$.pipe(
      map(tags => tags.filter(tag => tag.name == tagName)),
    ).subscribe(result => {foundTag = result});
    if (foundTag.length) {
      //
      // We found the Tag name in the allTags list
      //
      this.chipSelectedTags.push(foundTag[0]);
    } else {
      //
      // Create a new Tag, assigning a new higher tagId
      // This is the use case when allowFreeTextAddTag is true
      //
      let highestTagId = 0;
      this.allTags$.pipe(
        map(tags => [...tags].sort((a,b) => a.id - b.id)),
        map(sortedTags => sortedTags[sortedTags.length - 1]),
        tap(data => {
          highestTagId = data.id + 1
        })
      ).subscribe();
      this.chipSelectedTags.push({id: highestTagId,  name: tagName});
    }
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('min')) {
      return `Merci d'entrer une coordonnée valide (> ${ctrl.errors!['min']['min']})`;
    } else if (ctrl.hasError('max')) {
      return `Merci d'entrer une coordonnée valide (< ${ctrl.errors!['max']['max']})`;
    } else if (ctrl.hasError('minlength')) {
      return `Le nom n\'est pas assez long (min: ${ctrl.errors!['minlength']['requiredLength']})`;
    } else {
      return 'Ce champ contient une erreur';
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.allowFreeTextAddTag) {
      // only allowed to select from the filtered autocomplete list
      return;
    }
    if (this.matAutocomplete.isOpen) {
      return;
    }
    const value = (event.value || '');
    if ((value || '').trim()) {
      this.selectTagByName(value.trim());
    }
    event.chipInput!.clear();
    this.resetInputs();
  }

  removeTag(Tag: Tag): void {
    const index = this.chipSelectedTags.indexOf(Tag);
    if (index >= 0) {
      this.chipSelectedTags.splice(index, 1);
    }
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectTagByName(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.resetInputs();
  }

  resetInputs() {
    // clear control value and trigger TagControl.valueChanges event 
    this.tagControl.setValue(null); 
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit(){
    if(this.anemometerForm.invalid){
      return;
    }
    this.anemometerForm.value['tags'] = this.chipSelectedTags;
    this.anemometer$.pipe(
      take(1),
      tap(anemometer => {
        this.anemometersService.updateAnemometer(anemometer.id, this.anemometerForm.value)
        this.onGoback();
      })
    ).subscribe();
  }

  onGoback(){
    this.router.navigateByUrl('anemometer')
  }
}
