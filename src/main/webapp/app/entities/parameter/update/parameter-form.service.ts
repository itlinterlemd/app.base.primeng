import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParameter } from '../parameter.model';

type ParameterFormGroupContent = {
  id: FormControl<IParameter['id'] | null | undefined>;

  parameterName: FormControl<IParameter['parameterName'] | null | undefined>;
  description: FormControl<IParameter['description'] | null | undefined>;
  value: FormControl<IParameter['value'] | null | undefined>;
  code: FormControl<IParameter['code'] | null | undefined>;
  parentCode: FormControl<IParameter['parentCode'] | null | undefined>;
  initDate: FormControl<IParameter['initDate'] | null | undefined>;
  endDate: FormControl<IParameter['endDate'] | null | undefined>;
  dataType: FormControl<IParameter['dataType'] | null | undefined>;
  status: FormControl<IParameter['status'] | null | undefined>;
};

export type ParameterFormGroup = FormGroup<ParameterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParameterFormService {
  createParameterFormGroup(parameter: Partial<IParameter> = {}): ParameterFormGroup {
    const parameterRawValue = parameter;
    return new FormGroup<ParameterFormGroupContent>({
      id: new FormControl(parameterRawValue.id),

      parameterName: new FormControl(parameterRawValue.parameterName, {
        validators: [Validators.required],
      }),
      description: new FormControl(parameterRawValue.description),
      value: new FormControl(parameterRawValue.value, {
        validators: [Validators.required],
      }),
      code: new FormControl(parameterRawValue.code, {
        validators: [Validators.required],
      }),
      parentCode: new FormControl(parameterRawValue.parentCode),
      initDate: new FormControl(parameterRawValue.initDate),
      endDate: new FormControl(parameterRawValue.endDate),
      dataType: new FormControl(parameterRawValue.dataType),
      status: new FormControl(parameterRawValue.status),
    });
  }

  resetForm(form: ParameterFormGroup, parameter: Partial<IParameter> = {}): void {
    form.reset(parameter);
  }
}
