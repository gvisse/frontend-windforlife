import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-new-tag',
  templateUrl: './new-tag.component.html',
  styleUrls: ['./new-tag.component.scss']
})
export class NewTagComponent implements OnInit {

  tagCtrl!: FormControl;
  @Output() createdTag = new EventEmitter<{name:string}>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.tagCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(3)]);
  }

  onSubmit(){
    if(this.tagCtrl.invalid){
      return;
    }
    this.createdTag.emit({name:this.tagCtrl.value});
    this.tagCtrl.reset('');
  }
}
