import { Injectable } from '@nestjs/common';
import { obtenerEstadoActualizado } from './main';
import { NodoInterface } from './Universo/types';

@Injectable()
export class AppService {
  getHello(): NodoInterface[] {
    return obtenerEstadoActualizado();
  }
}
