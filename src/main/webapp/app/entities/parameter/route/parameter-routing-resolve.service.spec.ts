import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

import { IParameter } from '../parameter.model';
import { ParameterService } from '../service/parameter.service';

import parameterResolve from './parameter-routing-resolve.service';

describe('Service Tests', () => {
  describe('Parameter routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let service: ParameterService;
    let resultParameter: IParameter | null;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: convertToParamMap({}),
              },
            },
          },
          DatePipe,
        ],
      });
      mockRouter = TestBed.inject(Router);
      jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;

      service = TestBed.inject(ParameterService);
      resultParameter = null;
    });

    describe('resolve', () => {
      it('should return IParameter returned by find', () => {
        // GIVEN
        service.find = jest.fn(() => of(new HttpResponse({ body: { id: 123 } }) as any));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        TestBed.runInInjectionContext(() => {
          parameterResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              resultParameter = result;
            },
          });
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultParameter).toEqual({ id: 123 });
      });

      it('should return null if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        TestBed.runInInjectionContext(() => {
          parameterResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              resultParameter = result;
            },
          });
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultParameter).toEqual(null);
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null }) as any));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        TestBed.runInInjectionContext(() => {
          parameterResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              resultParameter = result;
            },
          });
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultParameter).toEqual(null);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
