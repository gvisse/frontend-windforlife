import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AnemometersService } from './anemometers.service';

describe('AnemometersService', () => {
	let service: AnemometersService;
	let httpMock: HttpTestingController;

	const mockAnemometer1 = {
		id: 1,
		name: 'Anemometer 1',
		latitude: '0',
		longitude: '0',
		altitude: 0,
		tags: []
	};
	const mockAnemometer2 = {
		id: 2,
		name: 'Anemometer 2',
		latitude: '1',
		longitude: '1',
		altitude: 1,
		tags: []
	};

	function flushRequest(url: string, method: string, response: {}) {
		const req = httpMock.expectOne(url);
		expect(req.request.method).toBe(method);
		req.flush(response);
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AnemometersService]
		});
		service = TestBed.inject(AnemometersService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should fetch anemometers from the server', () => {
		const anemometers = [mockAnemometer1, mockAnemometer2];
		const mockResponse = {
			results: anemometers,
			count: 2
		};
		service.getAnemometersFromServeur();
		service.anemometers$.subscribe(fetchedAnemometers => {
			expect(fetchedAnemometers).toEqual(anemometers);
		});
		flushRequest(`${environment.apiUrl}/anemometer/`, 'GET', mockResponse);
	});

	it('should not call the server if tags have been loaded in the last 5 minutes', () => {
		service.getAllAnemometers();
		service.allAnemometers$.subscribe(tags => {
			expect(tags).toEqual([mockAnemometer1, mockAnemometer2]);
		});

		flushRequest(`${environment.apiUrl}/anemometer/?page_size=0`, 'GET', [mockAnemometer1, mockAnemometer2])

		service.getAnemometersFromServeur();
		httpMock.expectNone(`${environment.apiUrl}/anemometer/`);
	})

	it('should fetch all anemometers from the server', () => {
		service.getAllAnemometers();
		service.allAnemometers$.subscribe(tags => {
			expect(tags).toEqual([mockAnemometer1, mockAnemometer2]);
		});
		flushRequest(`${environment.apiUrl}/anemometer/?page_size=0`, 'GET', [mockAnemometer1, mockAnemometer2])
	});

	it('should fetch a single anemometer by id', () => {
		const anemometer$ = service.getAnemometerById(1);
		anemometer$.subscribe(fetchedAnemometer => {
			expect(fetchedAnemometer).toEqual(mockAnemometer1);
		});
		flushRequest(`${environment.apiUrl}/anemometer/1`, 'GET', mockAnemometer1);
	});
	
	it('should create an anemometer', () => {
		const anemo1 = { name: 'Anemometer 1', latitude: 1, longitude: 1, altitude: 1, tags: [] };
		jest.spyOn(service, 'anemometers$', 'get').mockReturnValue(of([mockAnemometer1]))
		service.addAnemometer(anemo1);
		flushRequest(`${environment.apiUrl}/anemometer/`, 'POST', anemo1);
		flushRequest(`${environment.apiUrl}/anemometer/`, 'GET', [mockAnemometer1]);
	})

	it('should delete an anemometer from the server', () => {
		jest.spyOn(service, 'anemometers$', 'get').mockReturnValue(of([mockAnemometer1, mockAnemometer2]))
		service.deleteAnemometer(1);
		service.anemometers$.subscribe(anemometers => {
			expect(anemometers).toEqual([mockAnemometer2])
		})
		flushRequest(`${environment.apiUrl}/anemometer/1`, 'DELETE', {});
	});

	it('should make the correct HTTP request and update behavior subjects', () => {
		const page = 2;
		const size = 10;
		const mockHttpResponse = {
			results: [mockAnemometer1, mockAnemometer2],
			count: 20,
		};
		service.goToPage({ page, size });
		service.anemometers$.subscribe(anemometers => {
			expect(anemometers).toEqual(mockHttpResponse.results);
		});
		service.countAnemometers$.subscribe(count => {
			expect(count).toEqual(mockHttpResponse.count);
		});
		service.loading$.subscribe(loading => {
			expect(loading).toBeFalsy();
		})
		flushRequest(`${environment.apiUrl}/anemometer/?&page=${page}&page_size=${size}`, 'GET', of(mockHttpResponse));
	});

	it('should update anemometer in the anemometers list', () => {
		const mockUpdatedAnemometer = {
			id: 1,
			name: 'Updated Anemometer 1',
			latitude: '0',
			longitude: '0',
			altitude: 0,
			tags: []
		};
		jest.spyOn(service, 'anemometers$', 'get').mockReturnValue(of([mockUpdatedAnemometer, mockAnemometer2]));
		service.updateAnemometer(
			mockUpdatedAnemometer.id,
			{
				name: mockUpdatedAnemometer.name,
				tags: mockUpdatedAnemometer.tags
			}
		);
		flushRequest(`${environment.apiUrl}/anemometer/1/`, 'PATCH', mockUpdatedAnemometer);
		service.getAnemometerById(1).subscribe(anemometer => {
			expect(anemometer.name).toEqual(mockUpdatedAnemometer.name);
			expect(anemometer.tags).toEqual(mockUpdatedAnemometer.tags);
		});
		flushRequest(`${environment.apiUrl}/anemometer/1`, 'GET', mockUpdatedAnemometer);
	});
});
