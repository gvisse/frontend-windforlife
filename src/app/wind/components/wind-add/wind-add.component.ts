import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Anemometer } from 'src/app/anemometer/models/anemometer.model';
import { AnemometersService } from 'src/app/anemometer/services/anemometers.service';
import { WindsService } from '../../services/winds.service';

@Component({
  selector: 'app-wind-add',
  templateUrl: './wind-add.component.html',
  styleUrls: ['./wind-add.component.scss']
})
export class WindAddComponent implements OnInit {

  windForm!: FormGroup;

  allAnemometers$!: Observable<Anemometer[]>;
  filteredTags$!: Observable<Observable<string[]>>;

  anemometerCtrl = new FormControl();
  
  @Input() anemometer_id?: number;
  @Output() createdWind = new EventEmitter<{speed: number, time: Date, anemometer_id: number}>()

  constructor(private fb: FormBuilder,
              private anemometersService: AnemometersService,
              private windsService: WindsService)
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
        time: [null, [Validators.required,]],
        anemometer : this.anemometerCtrl
      },{
        updateOn: 'blur'
      }
    )
    if(this.anemometer_id){
      this.windForm.controls['anemometer'].setValue(this.anemometer_id);
      this.windForm.controls['anemometer'].disable();
    }
  }

  private initObservables(){
    this.allAnemometers$ = this.anemometersService.allAnemometers$;
  }

}
