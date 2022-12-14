import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';
import { Wind } from 'src/app/wind/models/wind.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class WindsService {
  constructor(private http: HttpClient){}
    
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _winds$ = new BehaviorSubject<Wind[]>([]);
  get winds$(): Observable<Wind[]> {
    return this._winds$.asObservable();
  }

  private _countWinds$ = new BehaviorSubject<number>(0);
  get countWinds$(): Observable<number>{
    return this._countWinds$.asObservable();
  }

  private setLoadingStatus(loading: boolean){
    this._loading$.next(loading);
  }

  private lastWindsLoaded = 0;

  private setUrl(params: {[key:string]: string|number|undefined}[]): string{
    let setParam = '';
    for(let param of params){
      for(let key in param){
        if(typeof param[key] !== 'undefined'){
          if(setParam == ''){
            setParam = '?';
          }
          setParam += `&${key}=${param[key]}`
        }
      }
    }
    return `${environment.apiUrl}/wind/${setParam}`;
  }

  private getWinds(anemometer_id?: number, page?: number, size?:number){
    const getUrl = this.setUrl([{'anemometer_id': anemometer_id}, {'page': page}, {'page_size': size}])
    this.http.get<Wind[]>(getUrl).pipe(
      tap((winds: any) => {
        this.lastWindsLoaded = Date.now();
        this._winds$.next(winds['results']);
        this._countWinds$.next(winds['count']);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getWindsFromServeur(){
    if (Date.now() - this.lastWindsLoaded <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.getWinds();
  }

  getWindsAnemometerByAnemometerId(id: number, page?: number, size?: number){  
    this.setLoadingStatus(true);
    this.getWinds(id, page, size);
    return this.winds$
  }

  createWind(formValue: {speed: number, direction: number, time: Date, anemometer_id: number}){
    this.setLoadingStatus(true);
    this.http.post<Wind>(`${environment.apiUrl}/wind/`, formValue).pipe(
      tap(() => this.getWinds())
    ).subscribe();
  }

  deleteWind(id: number, anemometer_id?: number){
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/wind/${id}`).pipe(
        tap(() => this.getWinds(anemometer_id))
    ).subscribe();
  }

  goToPage(anemometer_id: number|undefined, pageEvent: {page: number, size: number}): void{
    this.setLoadingStatus(true);
    this.getWinds(anemometer_id, pageEvent.page, pageEvent.size);
  }

}