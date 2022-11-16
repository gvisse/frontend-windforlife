import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Tag } from 'src/app/tag/models/tag.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  @Input() tags?: Tag[];
  @Output() newTag = new EventEmitter<string>();
  @Input() canAdd!: boolean;

  tagCtrl!: FormControl;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.tagCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
  }

  onAddTag(){
    if(this.tagCtrl.invalid){
      return;
    }
    this.newTag.emit(this.tagCtrl.value);
    this.tagCtrl.reset();
  }
}
