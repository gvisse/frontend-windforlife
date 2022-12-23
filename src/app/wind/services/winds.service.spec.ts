import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

import { WindsService } from './winds.service';

describe('WindsService', () => {
	let service: WindsService;
	let httpMock: HttpTestingController;

    const date2022 = new Date(2022, 12, 31);
    const date2023 = new Date(2023, 1, 1);

    const mockWind1 = {
        id: 1,
        speed: 5,
        direction: 90,
        cardinal: 'E',
        time: date2022,
        anemometer_id: 1
    }

    const mockWind2 = {
        id: 2,
        speed: 2.5,
        direction: 0,
        cardinal: 'N',
        time: date2023,
        anemometer_id: 1
    }

    function flushRequest(url: string, method: string, response: {}) {
		const req = httpMock.expectOne(url);
		expect(req.request.method).toBe(method);
		req.flush(response);
	}

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
			providers: [WindsService]
		});
		service = TestBed.inject(WindsService);
		httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

    it('should fetch winds from the server', () => {
		const winds = [mockWind1, mockWind2];
		const mockResponse = {
			results: winds,
			count: 2
		};
		service.getWindsFromServeur();
		service.winds$.subscribe(fetchedAnemometers => {
			expect(fetchedAnemometers).toEqual(winds);
		});
		flushRequest(`${environment.apiUrl}/wind/`, 'GET', mockResponse);
	});

    it('should not call the server if winds have been loaded in the last 5 minutes', () => {
		service.getWindsFromServeur();
		service.winds$.subscribe(winds => {
			expect(winds).toEqual([mockWind1, mockWind2]);
		});

		flushRequest(`${environment.apiUrl}/wind/`, 'GET', [mockWind1, mockWind2])
		service.getWindsFromServeur();
		httpMock.expectNone(`${environment.apiUrl}/wind/`);
	})

	it('should fetch winds for a single anemometer by id', () => {
		service.getWindsAnemometerByAnemometerId(1).subscribe(fetchedWinds => {
			expect(fetchedWinds).toEqual([mockWind1, mockWind2]);
		});
		flushRequest(`${environment.apiUrl}/wind/?&anemometer_id=1`, 'GET', [mockWind1, mockWind2]);
	});
	
});