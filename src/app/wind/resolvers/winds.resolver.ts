import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Wind } from '../models/wind.model';
import { WindsService } from '../services/winds.service';
import { Observable } from 'rxjs';

@Injectable()
export class WindsResolver implements Resolve<Wind[]> {
  constructor(private windsService: WindsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Wind[]> {
    return this.windsService.getTags();
  }
}