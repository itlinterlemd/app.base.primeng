import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData } from '../parameter.test-samples';

import { ParameterFormService } from './parameter-form.service';

describe('Parameter Form Service', () => {
  let service: ParameterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterFormService);
  });

  describe('Service methods', () => {
    describe('createParameterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createParameterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterName: expect.any(Object),
            description: expect.any(Object),
            value: expect.any(Object),
            code: expect.any(Object),
            parentCode: expect.any(Object),
            initDate: expect.any(Object),
            endDate: expect.any(Object),
            dataType: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });

      it('passing IParameter should create a new form with FormGroup', () => {
        const formGroup = service.createParameterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameterName: expect.any(Object),
            description: expect.any(Object),
            value: expect.any(Object),
            code: expect.any(Object),
            parentCode: expect.any(Object),
            initDate: expect.any(Object),
            endDate: expect.any(Object),
            dataType: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });
    });
  });
});
