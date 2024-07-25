import { IParameter } from './parameter.model';

export const sampleWithRequiredData: IParameter = {
  id: 23184,
  parameterName: 'Cadena',
  value: 'Claudio',
  code: 'incremental Canarias Diseñador',
};

export const sampleWithPartialData: IParameter = {
  id: 26894,
  parameterName: 'lateral',
  description: 'Galicia Ingeniero Extremadura',
  value: 'Pasaje Verde',
  code: 'Sorprendente',
  parentCode: 'Comunicaciones Calidad',
  initDate: new Date('2024-07-19T02:56'),
  endDate: new Date('2024-07-18T20:38'),
} as any as IParameter;

export const sampleWithFullData: IParameter = {
  id: 29967,
  parameterName: 'Llamas',
  description: 'nueva La Guapa',
  value: 'Futuro Granito Plástico',
  code: 'regional Hogar Rambla',
  parentCode: 'Baleares Guapa',
  initDate: new Date('2024-07-18T14:24'),
  endDate: new Date('2024-07-18T16:06'),
  dataType: 'Centrado Corporativo Humano',
  status: 'P',
};

export const sampleWithNewData: IParameter = {
  parameterName: 'Programa Rojo',
  value: 'Plástico',
  code: 'Interno Optimizado',
} as any as IParameter;

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
