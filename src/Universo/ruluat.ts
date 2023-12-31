import { NodoInterface, IValoresSistema, ValoresSistema } from './types';
import { siguienteGeneracion, crearNodo, expandirEspacio } from './fisica';

export class Universo {
  public nodos: NodoInterface[] = [];
  public tiempo = 0;
  public valoresSistema: IValoresSistema;
  private intervalo: NodeJS.Timeout;

  constructor(valoresSistema?: IValoresSistema) {
    if (valoresSistema) {
      console.log(valoresSistema);
      this.valoresSistema = valoresSistema;
    } else {
      this.valoresSistema = Object.keys(ValoresSistema)
        .filter((key) => isNaN(Number(key)))
        .reduce((obj, key) => {
          obj[key] = ValoresSistema[key];
          return obj;
        }, {} as IValoresSistema);
    }
    this.determinacionesDelSistema();
    this.intervalo = setInterval(() => {
      this.siguienteGeneracion();
      this.tiempo++;
    }, 100);
  }

  public obtenerEstadoActualizado(): {
    nodos: NodoInterface[];
    valoresSistema: IValoresSistema;
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
    for (let i = 0; i < this.valoresSistema.FILAS; i++) {
      for (let j = 0; j < this.valoresSistema.COLUMNAS; j++) {
        let cargas = Math.random() * 2 - 1;
        let energia = 1 - Math.abs(cargas);
        if (Math.random() > this.valoresSistema.PROBABILIDAD_VIDA_INICIAL) {
          cargas = 0;
          energia = 0;
        }
        const nodo: NodoInterface = crearNodo(i, j, cargas, energia);
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
