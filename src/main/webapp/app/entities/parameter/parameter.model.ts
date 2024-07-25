import { StatusRow } from 'app/entities/enumerations/status-row.model';

export interface IParameter {
  id: number;
  parameterName?: string | null;
  description?: string | null;
  value?: string | null;
  code?: string | null;
  parentCode?: string | null;
  initDate?: Date | null;
  endDate?: Date | null;
  dataType?: string | null;
  status?: keyof typeof StatusRow | null;
}

export function getParameterIdentifier(parameter: IParameter): number {
  return parameter.id;
}
