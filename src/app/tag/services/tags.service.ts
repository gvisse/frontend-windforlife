import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, lastValueFrom, map, Observable, switchMap, take, tap } from 'rxjs';
import { Tag } from 'src/app/tag/models/tag.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class TagsService {
  constructor(private http: HttpClient){}
    
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _tags$ = new BehaviorSubject<Tag[]>([]);
  get tags$(): Observable<Tag[]> {
    return this._tags$.asObservable();
  }

  private _countTags$ = new BehaviorSubject<number>(0);
  get countTags$(): Observable<number>{
    return this._countTags$.asObservable();
  }

  private _nextPage$ = new BehaviorSubject<string>('');
  get nextPage$(): Observable<string>{
    return this._nextPage$.asObservable();
  }

  private _previousPage$ = new BehaviorSubject<string>('');
  get previousPage$(): Observable<string>{
    return this._previousPage$.asObservable();
  }
  
  private setLoadingStatus(loading: boolean){
    this._loading$.next(loading);
  }

  private lastTagsLoaded = 0;

  private getTags(page?: number): void{
    let getUrl = `${environment.apiUrl}/tag/`;
    if(typeof page !== 'undefined' && page > 0){
      getUrl += `?page=${page}`
    }
    this.http.get<Tag[]>(getUrl).pipe(
      delay(1000),
      tap((tags:any) => {
        this.lastTagsLoaded = Date.now();
        this._tags$.next(tags['results']);
        this._countTags$.next(tags['count']);
        this._nextPage$.next(tags['next']);
        this._previousPage$.next(tags['previous']);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getTagsFromServeur(): void{
    if (Date.now() - this.lastTagsLoaded <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.getTags();
  }

  createTag(name: string): void{
    this.setLoadingStatus(true);
    this.http.post<Tag>(`${environment.apiUrl}/tag/`, {name : name}).pipe(
      delay(1000),
      tap(() => this.getTags())
    ).subscribe();
  }

  deleteTag(id: number): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/tag/${id}`).pipe(
        delay(1000),
        tap(() => this.getTags())
    ).subscribe();
  }

  goToPage(page: number): void{
    console.log(page)
    this.setLoadingStatus(true);
    this.getTags(page);
  }
}