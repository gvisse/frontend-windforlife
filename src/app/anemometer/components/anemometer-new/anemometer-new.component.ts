import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { Tag } from 'src/app/tag/models/tag.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagsService } from 'src/app/tag/services/tags.service';
import { AnemometersService } from '../../services/anemometers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anemometer-new',
  templateUrl: './anemometer-new.component.html',
  styleUrls: ['./anemometer-new.component.scss']
})
export class AnemometerNewComponent implements OnInit {

  anemometerForm!: FormGroup;
  
  chipSelectedTags: Tag[] = [];

  allTags$!: Observable<Tag[]>;
  filteredTags$!: Observable<Observable<string[]>>;

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
              private router: Router)
  {
  }

  get tags(){
    return this.anemometerForm.get('tags');
  }

  ngOnInit() {
    this.initForm();
    this.initObservables();
    this.tagsService.getTagsFromServeur();
  }

  private initForm(){
    this.anemometerForm = this.fb.group({
      name : [null, [Validators.required, Validators.minLength(5)]],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      altitude: [null, [Validators.required, Validators.min(-434), Validators.max(8849)]],
      tags: this.tagControl
    });
  }
  
  private initObservables(){
    this.allTags$ = this.tagsService.tags$;
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
      console.log('allowFreeTextAddTag is false');
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
    this.anemometersService.addAnemometer(this.anemometerForm.value);
    this.onGoback();
  }

  onGoback(){
    this.router.navigateByUrl('anemometer')
  }
}
