import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';

import { AnemometersService } from './anemometers.service';

describe('AnemometersService', () => {
	let service: AnemometersService;
	let httpMock: HttpTestingController;

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
		const anemometers = [{ id: 1, name: 'Anemometer 1' }, { id: 2, name: 'Anemometer 2' }];
		const mockResponse = {
			results: anemometers,
			count: 2
		};
		service.getAnemometersFromServeur();
		service.anemometers$.subscribe(fetchedAnemometers => {
			expect(fetchedAnemometers).toEqual(anemometers);
		});
		flushRequest(`${environment.apiUrl}/anemometer/?`, 'GET', mockResponse);
	});

	it('should fetch a single anemometer by id', () => {
		const anemometer = { id: 1, name: 'Anemometer 1', latitude: '1.25', 'longitude': 1.25, altitude: 0, tags: [] };
		const anemometer$ = service.getAnemometerById(1);
		anemometer$.subscribe(fetchedAnemometer => {
			expect(fetchedAnemometer).toEqual(anemometer);
		});
		flushRequest(`${environment.apiUrl}/anemometer/1`, 'GET', anemometer);
	});

	it('should delete an anemometer from the server', () => {
		// Arrange
		const anemo1 = { name: 'Anemometer 1', latitude: 1.25, 'longitude': 1.25, altitude: 0, tags: [] };
		const anemo2 = { name: 'Anemometer 2', latitude: 1.25, 'longitude': 1.25, altitude: 0, tags: [] }
		const expectedAnemometers = [
			{ id: 1, name: 'Anemometer 1', latitude: '1.25', 'longitude': '1.25', altitude: 0, tags: [] },
			{ id: 2, name: 'Anemometer 2', latitude: '1.25', 'longitude': '1.25', altitude: 0, tags: [] }
		];
		service.addAnemometer(anemo1);
		flushRequest(`${environment.apiUrl}/anemometer/`, 'POST', anemo1);
		flushRequest(`${environment.apiUrl}/anemometer/?`, 'GET', [anemo1]);
		service.addAnemometer(anemo2);
		flushRequest(`${environment.apiUrl}/anemometer/`, 'POST', anemo1);
		flushRequest(`${environment.apiUrl}/anemometer/?`, 'GET', expectedAnemometers);

		// Act
		service.deleteAnemometer(1);

		// Assert
		flushRequest(`${environment.apiUrl}/anemometer/1`, 'DELETE', {});
	});
});
