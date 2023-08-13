import { ValoresSistema, NodoInterface } from './types';
import {
  intercambiarCargas,
  materiaEntrante,
  cambioDeEstado,
  relacionarNodos,
  materiaSaliente,
  siguienteGeneracion,
} from './fisica';

export class Universo {
  private nodos: NodoInterface[] = [];
  private tiempo = 0;
  private intervalo: NodeJS.Timeout;

  constructor() {
    this.determinacionesDelSistema();
    this.intervalo = setInterval(() => {
      this.siguienteGeneracion();
      this.tiempo++;
    }, 500);
  }

  public obtenerEstadoActualizado(): NodoInterface[] {
    this.siguienteGeneracion();
    return this.nodos;
  }

  public detener(): void {
    clearInterval(this.intervalo);
  }

  private determinacionesDelSistema() {
    for (let i = 0; i < ValoresSistema.FILAS; i++) {
      for (let j = 0; j < ValoresSistema.COLUMNAS; j++) {
        const nodo: NodoInterface = {
          id: `nodo-${i}-${j}`,
          memoria: {
            cargas: Math.random() * 2 - 1,
            vivo:
              Math.random() > ValoresSistema.PROBABILIDAD_VIDA_INICIAL
                ? true
                : false,
            edad: 0,
            procesos: {
              materiaEntrante,
              cambioDeEstado,
              materiaSaliente,
              relacionarNodos,
              intercambiarCargas,
            },
            relaciones: [],
            propiedades: [],
          },
        };
        this.nodos.push(nodo);
      }
    }
  }

  private siguienteGeneracion() {
    siguienteGeneracion(this.nodos);
  }
}
