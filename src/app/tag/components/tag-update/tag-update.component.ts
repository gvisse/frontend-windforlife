import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, take, tap } from 'rxjs';
import { Tag } from '../../models/tag.model';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-tag-update',
  templateUrl: './tag-update.component.html',
  styleUrls: ['./tag-update.component.scss']
})
export class TagUpdateComponent implements OnInit {

  tagCtrl!: FormControl;

  tag$!: Observable<Tag>;

  constructor(private formBuilder: FormBuilder,
              private tagsService: TagsService,
              private route: ActivatedRoute,
              private router: Router)
  {

  }

  ngOnInit(): void {
    this.initObservables();
    this.initForm();
  }
  
  private initForm(){
    this.tagCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(3)]);
    this.setForm();
  }

  private setForm(){
    this.tag$.subscribe(tag=>{
      this.tagCtrl.setValue(tag.name);
    })
  }

  private initObservables(){
    this.tag$ = this.route.params.pipe(
      switchMap(params => this.tagsService.getTagById(+params['id']))
    );
  }

  onSubmit(){
    if(this.tagCtrl.invalid){
      return;
    }
    this.tag$.pipe(
      take(1),
      tap(tag => {
        this.tagsService.updateTag(tag.id, this.tagCtrl.value);
        this.onGoback();
      })
    ).subscribe();
  }

  onGoback(){
    this.router.navigateByUrl('tag');
  }
}
