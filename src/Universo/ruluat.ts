import { ValoresSistema, NodoInterface } from './types';
import { siguienteGeneracion, crearNodo, expandirEspacio } from './fisica';

export class Universo {
  private nodos: NodoInterface[] = [];
  private tiempo = 0;
  private valoresSistema = ValoresSistema;
  private intervalo: NodeJS.Timeout;

  constructor() {
    this.determinacionesDelSistema();
    this.intervalo = setInterval(() => {
      this.siguienteGeneracion();
      this.tiempo++;
    }, 500);
  }

  public obtenerEstadoActualizado(): {
    nodos: NodoInterface[];
    valoresSistema: typeof ValoresSistema;
  } {
    return {
      nodos: this.nodos,
      valoresSistema: this.valoresSistema,
    };
  }

  public detener(): void {
    clearInterval(this.intervalo);
  }

  public getValores(): any {
    return this.valoresSistema;
  }

  private determinacionesDelSistema() {
    for (let i = 0; i < ValoresSistema.FILAS; i++) {
      for (let j = 0; j < ValoresSistema.COLUMNAS; j++) {
        const nodo: NodoInterface = crearNodo(i, j);
        this.nodos.push(nodo);
      }
    }
  }

  private siguienteGeneracion() {
    this.nodos = siguienteGeneracion(this.nodos, this.valoresSistema);
    if (this.tiempo % 100 === 0) {
      expandirEspacio(this.nodos, this.valoresSistema);
    }
  }
}
