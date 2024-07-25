import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { finalize, Observable } from 'rxjs';

import { ParameterFormService, ParameterFormGroup } from './parameter-form.service';
import { IParameter } from '../parameter.model';
import { ParameterService } from '../service/parameter.service';
import { StatusRow } from 'app/entities/enumerations/status-row.model';

@Component({
  standalone: true,
  selector: 'jhi-parameter-update',
  templateUrl: './parameter-update.component.html',
  imports: [SharedModule, ReactiveFormsModule],
})
export class ParameterUpdateComponent implements OnInit {
  isSaving = false;
  statusOptions = Object.entries(StatusRow).map(([k]) => ({ label: k, value: k }));

  editForm: ParameterFormGroup = this.parameterFormService.createParameterFormGroup();

  constructor(
    protected parameterService: ParameterService,
    protected parameterFormService: ParameterFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isSaving = false;

    this.activatedRoute.data.subscribe(({ parameter }) => {
      this.updateForm(parameter);
    });
  }

  updateForm(parameter: IParameter | null): void {
    if (parameter) {
      this.editForm.reset({ ...parameter }, { emitEvent: false, onlySelf: true });
    } else {
      this.editForm.reset({
        initDate: new Date(),
        endDate: new Date(),
      });
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    if (this.editForm.valid) {
      this.isSaving = true;
      const parameter = this.editForm.value;
      if (parameter.id) {
        this.subscribeToSaveResponse(this.parameterService.update(parameter as IParameter));
      } else {
        this.subscribeToSaveResponse(this.parameterService.create(parameter as IParameter));
      }
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameter>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
