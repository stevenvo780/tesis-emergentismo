import { Injectable } from '@nestjs/common';
import { obtenerEstadoActualizado } from './main';

@Injectable()
export class AppService {
  getHello(): any {
    return obtenerEstadoActualizado();
  }
}
