import { Injectable } from '@angular/core';
import { StatusConfig, StatusConfigMap } from '../interfaces/status-config.interface';

@Injectable({
  providedIn: 'root'
})
export class StatusConfigService {

  /**
   * Configuraciones de estados para trackers de anillos (tabla)
   */
  private readonly ringStatusConfigs: StatusConfigMap = {
    'finalizado': {
      key: 'finalizado',
      label: 'Finalizado',
      color: '#44BD38',
      backgroundColor: '#E8F5E8',
      textColor: '#44BD38'
    },
    'en-proceso': {
      key: 'en-proceso',
      label: 'En Proceso',
      color: '#FFAA05',
      backgroundColor: '#FFF3E0',
      textColor: '#FFAA05'
    },
    'iniciado': {
      key: 'iniciado',
      label: 'Iniciado',
      color: '#151515',
      backgroundColor: '#F5F5F5',
      textColor: '#151515'
    },
    'observado': {
      key: 'observado',
      label: 'Observado',
      color: '#919191',
      backgroundColor: '#F5F5F5',
      textColor: '#919191'
    },
    'no-conforme': {
      key: 'no-conforme',
      label: 'No Conforme',
      color: '#E11F32',
      backgroundColor: '#FFEBEE',
      textColor: '#E11F32'
    },
    'deshabilitado': {
      key: 'deshabilitado',
      label: 'Deshabilitado',
      color: '#464646',
      backgroundColor: '#F5F5F5',
      textColor: '#464646'
    }
  };

  /**
   * Configuraciones de estados para indicadores circulares (modal)
   */
  private readonly circleStatusConfigs: StatusConfigMap = {
    'no-iniciada': {
      key: 'no-iniciada',
      label: 'No iniciada',
      color: '#919191',
      backgroundColor: '#F5F5F5',
      textColor: '#919191'
    },
    'en-progreso': {
      key: 'en-progreso',
      label: 'En progreso',
      color: '#015ca8',
      backgroundColor: '#E3F2FD',
      textColor: '#015ca8'
    },
    'bloqueada': {
      key: 'bloqueada',
      label: 'Bloqueada / En espera',
      color: '#FFAA05',
      backgroundColor: '#FFF3E0',
      textColor: '#FFAA05'
    },
    'finalizada': {
      key: 'finalizada',
      label: 'Finalizada / Completada',
      color: '#44bd38',
      backgroundColor: '#E8F5E8',
      textColor: '#44bd38'
    },
    'requiere-revision': {
      key: 'requiere-revision',
      label: 'Requiere revisión / ajustes',
      color: '#E11F32',
      backgroundColor: '#FFEBEE',
      textColor: '#E11F32'
    }
  };

  /**
   * Obtiene la configuración de un estado de anillo
   */
  getRingStatusConfig(statusKey: string): StatusConfig {
    return this.ringStatusConfigs[statusKey] || this.getDefaultRingStatus();
  }

  /**
   * Obtiene la configuración de un estado circular
   */
  getCircleStatusConfig(statusKey: string): StatusConfig {
    return this.circleStatusConfigs[statusKey] || this.getDefaultCircleStatus();
  }

  /**
   * Obtiene todas las configuraciones de estados de anillo
   */
  getAllRingStatusConfigs(): StatusConfig[] {
    return Object.values(this.ringStatusConfigs);
  }

  /**
   * Obtiene todas las configuraciones de estados circulares
   */
  getAllCircleStatusConfigs(): StatusConfig[] {
    return Object.values(this.circleStatusConfigs);
  }

  /**
   * Mapea un estado de anillo a un estado circular
   */
  mapRingToCircleConfig(ringStatusKey: string): StatusConfig {
    const mapping: Record<string, string> = {
      'finalizado': 'finalizada',
      'en-proceso': 'en-progreso',
      'iniciado': 'en-progreso',
      'observado': 'no-iniciada',
      'no-conforme': 'requiere-revision',
      'deshabilitado': 'bloqueada'
    };

    const circleKey = mapping[ringStatusKey] || 'no-iniciada';
    return this.getCircleStatusConfig(circleKey);
  }

  /**
   * Mapea un estado circular a un estado de anillo
   */
  mapCircleToRingConfig(circleStatusKey: string): StatusConfig {
    const mapping: Record<string, string> = {
      'finalizada': 'finalizado',
      'en-progreso': 'en-proceso',
      'bloqueada': 'deshabilitado',
      'requiere-revision': 'no-conforme',
      'no-iniciada': 'observado'
    };

    const ringKey = mapping[circleStatusKey] || 'observado';
    return this.getRingStatusConfig(ringKey);
  }

  /**
   * Estado de anillo por defecto
   */
  private getDefaultRingStatus(): StatusConfig {
    return this.ringStatusConfigs['observado'];
  }

  /**
   * Estado circular por defecto
   */
  private getDefaultCircleStatus(): StatusConfig {
    return this.circleStatusConfigs['no-iniciada'];
  }
}