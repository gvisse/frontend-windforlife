import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagsService } from './tags.service';
import { of } from 'rxjs';

describe('TagsService', () => {
	let service: TagsService;
	let httpMock: HttpTestingController;
	const apiUrl = 'http://localhost:8000/api';
	const mockResponseTag = { id: 1, name: 'tag1' };
	const mockResponseTagList = [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }];

	function flushRequest(url: string, method: string, response: {}) {
		const req = httpMock.expectOne(url);
		expect(req.request.method).toBe(method);
		req.flush(response);
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [TagsService]
		}).compileComponents();

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
			});

			flushRequest(`${apiUrl}/tag/?page_size=0`, 'GET', mockResponseTagList)
		});
	});

	describe('getTagsFromServer', () => {
		it('should get tags of the first page', () => {
			service.getTagsFromServer();

			service.tags$.subscribe(tags => {
				expect(tags).toEqual(mockResponseTagList);
			});
			flushRequest(`${apiUrl}/tag/`, 'GET', mockResponseTagList)
		});

		it('should not call the server if tags have been loaded in the last 5 minutes', () => {
			service.getAllTags();
			service.allTags$.subscribe(tags => {
				expect(tags).toEqual(mockResponseTagList);
			});

			flushRequest(`${apiUrl}/tag/?page_size=0`, 'GET', mockResponseTagList)

			service.getTagsFromServer();
			httpMock.expectNone(`${apiUrl}/tag/`);
		})
	});

	describe('getTagById', () => {
		it('should return an observable of a tag', () => {
			service.getTagById(1).subscribe(tag => {
				expect(tag).toEqual(mockResponseTag);
			});

			flushRequest(`${apiUrl}/tag/1/`, 'GET', mockResponseTag)
		});
	});

	describe('createTag, updateTag and deleteTag', () => {

		beforeEach(() => {
			service.createTag('tag1').subscribe(tag => {
				expect(tag).toEqual(mockResponseTag);
			});

		});

		function flushRequestOfCreateTag(response: {}) {
			flushRequest(`${apiUrl}/tag/`, 'POST', response);
			flushRequest(`${apiUrl}/tag/`, 'GET', response);
		}

		it('should return an observable of the created Tag', () => {
			flushRequestOfCreateTag(mockResponseTag);
		});

		it('should create and update a tag', () => {
			flushRequestOfCreateTag(mockResponseTag);
			const tags = [
				{ id: 1, name: 'Tag 1' },
				{ id: 2, name: 'Tag 2' },
				{ id: 3, name: 'Tag 3' },
			];
			const tagId = 2;
			const updatedName = 'Updated Tag Name';
			const expectedTags = [
				{ id: 1, name: 'Tag 1' },
				{ id: 2, name: updatedName },
				{ id: 3, name: 'Tag 3' },
			];

			jest.spyOn(service, 'tags$', 'get').mockReturnValue(of(tags));

			service.updateTag(tagId, updatedName);
			service.tags$.subscribe(updatedTags => {
				expect(updatedTags).toEqual(expectedTags);
			})

			flushRequest(`${apiUrl}/tag/${tagId}/`, 'PATCH', expectedTags)
		});

		it('should delete a tag', () => {
			flushRequestOfCreateTag(mockResponseTag);
			service.deleteTag(1);

			flushRequest(`${apiUrl}/tag/1/`, 'DELETE', 1);
			flushRequest(`${apiUrl}/tag/`, 'GET', {});
			service.getTagById(1).subscribe();
			flushRequest(`${apiUrl}/tag/1/`, 'GET', {});
		});

	});

	describe('goToPage', () => {
		it('should go to page X with N tags of page size', () => {
			jest.spyOn(service, 'tags$', 'get').mockReturnValue(of([
				{ id: 11, name: 'tag11' },
				{ id: 12, name: 'tag12' }
			]));
			jest.spyOn(service, 'countTags$', 'get').mockReturnValue(of(12));
			jest.spyOn(service, 'loading$', 'get').mockReturnValue(of(false));
			const mockResponse = {
				count: 12,
				next: null,
				previous: `${apiUrl}/tag/`,
				results: [
					{ id: 11, name: 'tag11' },
					{ id: 12, name: 'tag12' }
				]
			};

			service.goToPage({ page: 2, size: 10 });
			flushRequest(`${apiUrl}/tag/?&page=2&page_size=10`, 'GET', mockResponse);

			service.tags$.subscribe(tags => {
				expect(tags).toEqual([
					{ id: 11, name: 'tag11' },
					{ id: 12, name: 'tag12' }
				]);
			});
			service.countTags$.subscribe(count => {
				expect(count).toEqual(12);
			});
			service.loading$.subscribe(loading => {
				expect(loading).toBeFalsy();
			});
		});
	});

});