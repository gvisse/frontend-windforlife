import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Anemometer } from '../models/anemometer.model';
import { AnemometersService } from '../services/anemometers.service';
import { Observable } from 'rxjs';

@Injectable()
export class AnemometerByIdResolver implements Resolve<Anemometer> {
  constructor(private anemometersService: AnemometersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Anemometer> {
    return this.anemometersService.getAnemometerById(+route.paramMap.get('id')!);
  }
}