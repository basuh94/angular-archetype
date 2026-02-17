import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-error.model';

export function mapHttpErrorToApiError(error: HttpErrorResponse): ApiError {
  if (error.status === 0) {
    return {
      type: 'network',
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'No hay conexión con el servidor.',
      url: error.url,
    };
  }

  if (error.status >= 500) {
    return {
      type: 'server',
      status: error.status,
      code: 'SERVER_ERROR',
      message: 'Error interno del servidor. Inténtalo más tarde.',
      url: error.url,
    };
  }

  if (error.status === 404) {
    return {
      type: 'client',
      status: error.status,
      code: 'NOT_FOUND',
      message: 'No se encontró el recurso solicitado.',
      url: error.url,
    };
  }

  if (error.status === 401 || error.status === 403) {
    return {
      type: 'client',
      status: error.status,
      code: 'UNAUTHORIZED',
      message: 'No tienes permisos para esta operación.',
      url: error.url,
    };
  }

  if (error.status >= 400) {
    return {
      type: 'client',
      status: error.status,
      code: 'BAD_REQUEST',
      message: 'La solicitud no es válida.',
      url: error.url,
    };
  }

  return {
    type: 'unknown',
    status: error.status,
    code: 'UNKNOWN_ERROR',
    message: 'Ha ocurrido un error inesperado.',
    url: error.url,
  };
}
