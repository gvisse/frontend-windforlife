import { Component, OnInit } from '@angular/core';
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

  constructor(private formBuilder: FormBuilder,
              private tagsService: TagsService,
              private router: Router) { }

  ngOnInit(): void {
    this.tagCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(3)]);
  }

  onSubmit(){
    if(this.tagCtrl.invalid){
      return;
    }
    this.tagsService.createTag(this.tagCtrl.value).pipe(
      tap(() => this.router.navigateByUrl('tag'))
    ).subscribe();
  }
}
