import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Anemometer } from '../../../anemometer/models/anemometer.model';
import { AnemometersService } from '../../../anemometer/services/anemometers.service';
import { dateValidator } from '../../validators/dateInFuture.validator';

@Component({
  selector: 'app-wind-add',
  templateUrl: './wind-add.component.html',
  styleUrls: ['./wind-add.component.scss']
})
export class WindAddComponent implements OnInit {

  windForm!: FormGroup;

  allAnemometers$!: Observable<Anemometer[]>;
  filteredTags$!: Observable<Observable<string[]>>;
  
  @Input() anemometer_id?: number;
  @Output() createdWind = new EventEmitter<{speed: number, direction: number, time: Date, anemometer_id: number}>()

  constructor(private fb: FormBuilder,
              private anemometersService: AnemometersService)
  {
  }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
    this.anemometersService.getAllAnemometers();
  }

  private initForm(){
    this.windForm = this.fb.group(
      {
        speed: [null, [Validators.required, Validators.min(0)]],
        direction: [null, [Validators.required, Validators.min(0), Validators.max(360)]],
        time: [null, [Validators.required, dateValidator()]],
        anemometer_id : [null, [Validators.required]]
      },{
        updateOn: 'blur'
      }
    )
    if(this.anemometer_id){
      this.windForm.controls['anemometer_id'].setValue(this.anemometer_id);
    }
  }

  private initObservables(){
    this.allAnemometers$ = this.anemometersService.allAnemometers$;
  }

  onSubmit(){
    if(this.windForm.invalid){
      return;
    }
    this.createdWind.emit(this.windForm.value)
    this.windForm.reset('')
  }

}
