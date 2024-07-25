import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';
import { FilterMetadata, MessageService } from 'primeng/api';
import { IParameter } from '../parameter.model';
import SharedModule from 'app/shared/shared.module';
import { ParameterService } from '../service/parameter.service';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { FormsModule } from '@angular/forms';
import {
  lazyLoadEventToServerQueryParams,
  lazyLoadEventToRouterQueryParams,
  fillTableFromQueryParams,
} from 'app/core/request/request-util';
import { ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'jhi-parameter',
  templateUrl: './parameter.component.html',
  imports: [RouterModule, FormsModule, SharedModule],
})
export class ParameterComponent implements OnInit {
  parameters?: IParameter[];
  eventSubscriber?: Subscription;
  totalItems?: number;
  itemsPerPage!: number;
  loading!: boolean;

  @ViewChild('parameterTable', { static: true })
  parameterTable!: Table;

  private filtersDetails: { [_: string]: { type: string } } = {
    id: { type: 'number' },
    parameterName: { type: 'string' },
    description: { type: 'string' },
    value: { type: 'string' },
    code: { type: 'string' },
    parentCode: { type: 'string' },
    initDate: { type: 'dateTime' },
    endDate: { type: 'dateTime' },
    dataType: { type: 'string' },
    status: { type: 'string' },
  };

  constructor(
    protected parameterService: ParameterService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.loading = true;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => fillTableFromQueryParams(this.parameterTable, queryParams, this.filtersDetails)),
        tap(() => (this.loading = true)),
        switchMap(() =>
          this.parameterService.query(
            lazyLoadEventToServerQueryParams(this.parameterTable.createLazyLoadMetadata(), undefined, this.filtersDetails)
          )
        ),
        // TODO add catchError inside switchMap in blueprint
        filter((res: HttpResponse<IParameter[]>) => res.ok)
      )
      .subscribe(
        (res: HttpResponse<IParameter[]>) => {
          this.paginateParameters(res.body!, res.headers);
          this.loading = false;
        },
        (err: HttpErrorResponse) => {
          this.onError(err.message);
          console.error(err);
          this.loading = false;
        }
      );
  }

  get filters(): { [s: string]: FilterMetadata } {
    return this.parameterTable.filters as { [s: string]: FilterMetadata };
  }

  onLazyLoadEvent(event: TableLazyLoadEvent): void {
    const queryParams = lazyLoadEventToRouterQueryParams(event, this.filtersDetails);
    this.router.navigate(['/parameter'], { queryParams });
  }

  delete(id: number): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('entity.delete.title'),
      message: this.translateService.instant('gatewayApp.parameter.delete.question', { id }),
      accept: () => {
        this.parameterService.delete(id).subscribe(() => {
          this.router.navigate(['/parameter'], { queryParams: { r: Date.now() }, queryParamsHandling: 'merge' });
        });
      },
    });
  }

  trackId(index: number, item: IParameter): number {
    return item.id;
  }

  protected paginateParameters(data: IParameter[], headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.parameters = data;
  }

  protected onError(errorMessage: string): void {
    this.messageService.add({ severity: 'error', summary: errorMessage });
  }
}
