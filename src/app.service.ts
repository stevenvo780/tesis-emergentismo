import { Injectable } from '@nestjs/common';
import { obtenerEstadoActualizado, NodoInterface } from './life';

@Injectable()
export class AppService {
  getHello(): NodoInterface[] {
    return obtenerEstadoActualizado();
  }
}
