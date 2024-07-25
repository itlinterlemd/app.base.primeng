import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe } from 'app/shared/date/duration.pipe';
import { IParameter } from '../parameter.model';

@Component({
  standalone: true,
  selector: 'jhi-parameter-detail',
  templateUrl: './parameter-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe],
})
export class ParameterDetailComponent {
  @Input() parameter: IParameter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
