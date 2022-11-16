import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { Tag } from 'src/app/tag/models/tag.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class TagsService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tag/`);
  }

  createTag(name: string): Observable<Tag>{
    return this.getTags().pipe(
      map(tags=> (tags as any)['results']),
      map(tags=>[...tags].sort((a,b) => a.id - b.id)),
      map(sortedTags => sortedTags[sortedTags.length - 1]),
      map(previousTag => ({
        id: previousTag.id + 1,
        name: name
      })),
      switchMap(newTag => this.http.post<Tag>(`${environment.apiUrl}/tag/`, newTag)));
  }

  deleteTag(id: number): void {
    this.http.delete(`${environment.apiUrl}/tag/${id}`).pipe(
      switchMap(() => this.getTags()),
      take(1),
      map(tags => tags.filter(tag => tag.id !== id)),
    ).subscribe();
  }
}