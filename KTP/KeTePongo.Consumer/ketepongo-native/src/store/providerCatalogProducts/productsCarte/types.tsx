import { IProviderCatalogProductsPayload } from '../types';
import { CatalogProductDTO, SectionDTO } from "../../../model/DTOs";
import {ErrorDetail} from "store";

// ***** Types
export enum ProductCarteTypes {
  UPDATE_PRODUCTCARTE_REQUESTED = 'UPDATE_PRODUCTCARTE_REQUESTED',
  UPDATE_PRODUCTCARTE_SUCCEEDED = 'UPDATE_PRODUCTCARTE_SUCCEEDED',
  UPDATE_PRODUCTCARTE_FAILED = 'UPDATE_PRODUCTCARTE_FAILED',
  ADD_PRODUCTCARTE_TO_CATALOG_REQUESTED = 'ADD_PRODUCTCARTE_TO_CATALOG_REQUESTED',
  ADD_PRODUCTCARTE_TO_CATALOG_SUCCEEDED = 'ADD_PRODUCTCARTE_TO_CATALOG_SUCCEEDED ',
  ADD_PRODUCTCARTE_TO_CATALOG_FAILED = 'ADD_PRODUCTCARTE_TO_CATALOG_FAILED',
  DELETE_PRODUCTCARTE_FROM_CATALOG_REQUESTED = 'DELETE_PRODUCTCARTE_FROM_CATALOG_REQUESTED',
  DELETE_PRODUCTCARTE_FROM_CATALOG_SUCCEEDED = 'DELETE_PRODUCTCARTE_FROM_CATALOG_SUCCEEDED',
  DELETE_PRODUCTCARTE_FROM_CATALOG_FAILED = 'DELETE_PRODUCTCARTE_FROM_CATALOG_FAILED',
  CLEAR_PRODUCTCARTE_ERROR = 'CLEAR_PRODUCTCARTE_ERROR',
  NAVIGATE = 'NAVIGATE',
  REMOVE_ERROR = 'REMOVE_ERROR',
  UPDATE_PRODUCTCARTE_DISPLAY_ORDER_REQUESTED ='UPDATE_PRODUCTCARTE_DISPLAY_ORDER_REQUESTED',
  UPDATE_PRODUCTCARTE_DISPLAY_ORDER_SUCCEEDED ='UPDATE_PRODUCTCARTE_DISPLAY_ORDER_SUCCEEDED',
  UPDATE_PRODUCTCARTE_DISPLAY_ORDER_FAILED ='UPDATE_PRODUCTCARTE_DISPLAY_ORDER_FAILED'
};

// ***** Reducer
export interface IProductsCarteState {
  list: CatalogProductDTO[],
  dictionary: ICatalogProductHash,
  loading: boolean,
  error: ErrorDetail | null
}

export interface ICatalogProductAction {
  type: string,
  payload: ICatalogProductPayload
}

export type ICatalogProductPayload = (
  IProviderCatalogProductsPayload |
  number
);


export interface ICatalogProductParam {
  target?: string,
}

export type ICatalogProductMultiParams = {
  target?: string,
  editProductCarteId: boolean,
}

export interface ICatalogProductHash {
  [details: string]: CatalogProductDTO
}
