import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, lastValueFrom, map, Observable, switchMap, take, tap } from 'rxjs';
import { Tag } from 'src/app/tag/models/tag.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class TagsService {

  apiUrl: string = environment.apiUrl;
  
  constructor(private http: HttpClient){}
    
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _tags$ = new BehaviorSubject<Tag[]>([]);
  get tags$(): Observable<Tag[]> {
    return this._tags$.asObservable();
  }

  private _allTags$ = new BehaviorSubject<Tag[]>([]);
  get allTags$(): Observable<Tag[]> {
    return this._allTags$.asObservable();
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

  private setUrl(params: {[key:string]: string|number|undefined}[]): string{
    let getUrl = `${environment.apiUrl}/tag/?`;
    for(let param of params){
      for(let key in param){
        if(typeof param[key] !== 'undefined') getUrl += `&${key}=${param[key]}`
      }
    }
    return getUrl;
  }

  private getTags(page?: number, size?: number): void{
    const getUrl = this.setUrl([{'page': page}, {'page_size': size}]);
    this.http.get<Tag[]>(getUrl).pipe(
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

  getAllTags(): void{
    this.setLoadingStatus(true);
    this.http.get<Tag[]>(`${environment.apiUrl}/tag/?page_size=0`).pipe(
      tap((tags:any) => {
        this.lastTagsLoaded = Date.now();
        this._allTags$.next(tags);
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

  getTagById(id: number): Observable<Tag>{
    return this.http.get<Tag>(`${environment.apiUrl}/tag/${id}`);
  }

  createTag(name: string): void{
    this.setLoadingStatus(true);
    this.http.post<Tag>(`${environment.apiUrl}/tag/`, {name : name}).pipe(
      tap(() => this.getTags())
    ).subscribe();
  }

  updateTag(id: number, name: string){
    this.tags$.pipe(
      take(1),
      map(tags => tags
          .map(tag => tag.id === id ?
              {id: tag.id, name: name}:
              tag
          )
      ),
      tap(updatedTags => this._tags$.next(updatedTags)),
      switchMap(updatedTags =>
        this.http.patch(`${environment.apiUrl}/tag/${id}/`,
        updatedTags.find(tag => tag.id === id))
      )
    ).subscribe();
  }

  deleteTag(id: number): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/tag/${id}`).pipe(
        tap(() => this.getTags())
    ).subscribe();
  }

  goToPage(pageEvent: {page: number, size: number}): void{
    this.setLoadingStatus(true);
    this.getTags(pageEvent.page, pageEvent.size);
  }
}