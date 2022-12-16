import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagsService } from './tags.service';
import { tap } from 'rxjs';

describe('TagsService', () => {
  let service: TagsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8000/api';
  const mockResponseTag = { id: 1, name: 'tag1' };
  const mockResponseTagList = [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }];


  beforeEach(() => {
	TestBed.configureTestingModule({
	  imports: [HttpClientTestingModule],
	  providers: [TagsService]
	});
	service = TestBed.inject(TagsService);
	httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
	httpMock.verify();
  });

  it('should be created', () => {
	expect(service).toBeTruthy();
  });

  describe('getAllTags', () => {
	it('should return an observable of all tags', () => {
	  service.getAllTags();
	  service.allTags$.subscribe(tags => {
		expect(tags).toEqual(mockResponseTagList);
	  })

	  const req = httpMock.expectOne(`${apiUrl}/tag/?page_size=0`);
	  expect(req.request.method).toBe('GET');
	  req.flush(mockResponseTagList);
	});
  });

  describe('getTagsFromServer', () => {
	it('should get tags of the first page', () => {
	  service.getTagsFromServer();

	  service.tags$.subscribe(tags => {
		expect(tags).toEqual(mockResponseTagList);
	  })

	  const req = httpMock.expectOne(`${apiUrl}/tag/`);
	  expect(req.request.method).toBe('GET');
	  req.flush(mockResponseTagList);
	});
  });

  describe('getTagById', () => {
	it('should return an observable of a tag', () => {      
	  service.getTagById(1).subscribe(tag => {
		expect(tag).toEqual(mockResponseTag);
	  });

	  const req = httpMock.expectOne(`${apiUrl}/tag/1/`);
	  expect(req.request.method).toBe('GET');
	  req.flush(mockResponseTag);
	});
  });

  describe('createTag, updateTag and deleteTag', () => {

	beforeEach(() => {
		service.createTag('tag1').subscribe(tag => {
			expect(tag).toEqual(mockResponseTag);
		});
	});

	function flushRequestOfCreateTag(){
		const req1_1 = httpMock.expectOne(`${apiUrl}/tag/`);
		expect(req1_1.request.method).toBe('POST');
		req1_1.flush(mockResponseTag);

		const req1_2 = httpMock.expectOne(`${apiUrl}/tag/`);
		expect(req1_2.request.method).toBe('GET');
		req1_2.flush(mockResponseTag);
	}

	it('should return an observable of the created Tag', () => {
		flushRequestOfCreateTag();
	});

	it('should update a tag', () => {
		flushRequestOfCreateTag();
		const mockResponseUpdate = { id: 1, name: 'tagTest1' };
		service.updateTag(1, 'tagTest1');

		service.getTagById(1).subscribe(tag => {
			expect(tag).toEqual(mockResponseUpdate);
		});

		const req2 = httpMock.expectOne(`${apiUrl}/tag/1/`);
		expect(req2.request.method).toBe('GET');
		req2.flush(mockResponseUpdate);
	});

	it('should delete a tag', () => {   
	  flushRequestOfCreateTag();
	  service.deleteTag(1);

	  const req2_1 = httpMock.expectOne(`${apiUrl}/tag/1/`);
	  expect(req2_1.request.method).toBe('DELETE');
	  req2_1.flush(1);

	  const req2_2 = httpMock.expectOne(`${apiUrl}/tag/`);
	  expect(req2_2.request.method).toBe('GET');
	  req2_2.flush({});

	  service.getTagById(1).subscribe();
	  
	  const req2_3 = httpMock.expectOne(`${apiUrl}/tag/1/`);
	  expect(req2_3.request.method).toBe('GET');
	  req2_3.flush({});
	});
	
  });

  describe('goToPage', () => {
	it('should go to page X with N tags of page size', () => {
		const mockResponse = {
			count : 12,
			next: null,
			previous: `${apiUrl}/tag/`,
			results: [
				{ id: 11, name: 'tag11' },
				{ id: 12, name: 'tag12' }
			]
		};

		service.goToPage({page:2, size: 10});

		const req1 = httpMock.expectOne(`${apiUrl}/tag/?&page=2&page_size=10`);
		expect(req1.request.method).toBe('GET');
		req1.flush(mockResponse);
	});
  });

});