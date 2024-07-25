import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParameter, getParameterIdentifier } from '../parameter.model';

type RestOf<T extends IParameter> = Omit<T, 'initDate' | 'endDate'> & {
  initDate?: string | null;
  endDate?: string | null;
};

export type RestParameter = RestOf<IParameter>;

export type EntityResponseType = HttpResponse<IParameter>;
export type EntityArrayResponseType = HttpResponse<IParameter[]>;

@Injectable({ providedIn: 'root' })
export class ParameterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parameters','orbi');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parameter: IParameter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parameter);
    return this.http
      .post<RestParameter>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(parameter: IParameter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parameter);
    return this.http
      .put<RestParameter>(`${this.resourceUrl}/${getParameterIdentifier(parameter)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(parameter: IParameter): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parameter);
    return this.http
      .patch<RestParameter>(`${this.resourceUrl}/${getParameterIdentifier(parameter)!}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestParameter>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestParameter[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient<T extends IParameter>(parameter: T): RestOf<T> {
    return {
      ...parameter,
      initDate: parameter.initDate?.toJSON() ?? null,
      endDate: parameter.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restParameter: RestParameter): IParameter {
    return {
      ...restParameter,
      initDate: restParameter.initDate ? new Date(restParameter.initDate) : undefined,
      endDate: restParameter.endDate ? new Date(restParameter.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestParameter>): HttpResponse<IParameter> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestParameter[]>): HttpResponse<IParameter[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
