import { Universo } from './ruluat';
import { NodoInterface, ValoresSistema, IValoresSistema } from './types';

export class Entrenador {
  public universo: Universo;
  public tiempoSinEstructuras = 0;
  public tiempoLimiteSinEstructuras = 100;
  private intervalo: NodeJS.Timeout;
  private pesos: IValoresSistema;
  private tasaDeAprendizaje = 0.05;

  constructor() {
    this.universo = new Universo();
    this.inicializarPesos();
    this.intervalo = setInterval(() => this.entrenarPerpetuo(), 500);
  }

  private inicializarPesos() {
    this.pesos = Object.keys(ValoresSistema)
      .filter((key) => isNaN(Number(key)))
      .reduce((obj, key) => {
        obj[key] = ValoresSistema[key];
        return obj;
      }, {} as IValoresSistema);
  }

  private calcularRecompensa(nodos: NodoInterface[]): number {
    return this.detectarEstructuras(nodos);
  }

  private actualizarPesos(recompensa: number) {
    this.pesos.FILAS = ValoresSistema.FILAS;
    this.pesos.COLUMNAS = ValoresSistema.COLUMNAS;
    this.pesos.CRECIMIENTO_X = ValoresSistema.CRECIMIENTO_X;
    this.pesos.CRECIMIENTO_Y = ValoresSistema.CRECIMIENTO_Y;
    this.pesos.PROBABILIDAD_VIDA_INICIAL += this.tasaDeAprendizaje * recompensa;
    this.pesos.LIMITE_EDAD += this.tasaDeAprendizaje * recompensa;
    this.pesos.REDUCCION_CARGA += this.tasaDeAprendizaje * recompensa;
    this.pesos.UMBRAL_CARGA += this.tasaDeAprendizaje * recompensa;
    this.pesos.FACTOR_ESTABILIDAD += this.tasaDeAprendizaje * recompensa;
    this.pesos.LIMITE_RELACIONAL += this.tasaDeAprendizaje * recompensa;
    this.pesos.DISTANCIA_MAXIMA_RELACION += this.tasaDeAprendizaje * recompensa;
    this.pesos.FACTOR_RELACION += this.tasaDeAprendizaje * recompensa;
    this.pesos.ENERGIA += this.tasaDeAprendizaje * recompensa;
    this.pesos.PROBABILIDAD_TRANSICION += this.tasaDeAprendizaje * recompensa;
    this.pesos.FLUCTUACION_MAXIMA += this.tasaDeAprendizaje * recompensa;
    this.pesos.PROBABILIDAD_TUNEL += this.tasaDeAprendizaje * recompensa;
    this.pesos.ESPERADO_EMERGENTE += this.tasaDeAprendizaje * recompensa;
  }

  private detectarEstructuras(nodos: NodoInterface[]): number {
    let numeroDeEstructuras = 0;
    const nodosVisitados = new Set<string>();

    nodos.forEach((nodo) => {
      if (nodosVisitados.has(nodo.id)) return;
      const nodosRelacionados = nodo.memoria.relaciones.map(
        (rel) => rel.nodoId,
      );
      if (
        nodosRelacionados.length >=
        this.universo.valoresSistema.ESPERADO_EMERGENTE
      ) {
        const esEstructuraValida = nodosRelacionados.every((idRelacionado) => {
          const nodoRelacionado = nodos.find((n) => n.id === idRelacionado);
          return (
            nodoRelacionado &&
            nodoRelacionado.memoria.energia >
              this.universo.valoresSistema.ENERGIA
          );
        });

        if (esEstructuraValida) {
          nodosRelacionados.forEach((idRelacionado) =>
            nodosVisitados.add(idRelacionado),
          );
          numeroDeEstructuras++;
        }
      }
    });

    return numeroDeEstructuras;
  }

  private reiniciarUniverso(): void {
    this.universo.detener();
    this.universo = new Universo(this.pesos); // Puedes pasar los pesos actualizados aquí si es necesario
  }

  private entrenarPerpetuo() {
    const estadoActual = this.universo.obtenerEstadoActualizado();
    if (this.hayEstructuras(estadoActual.nodos)) {
      this.tiempoSinEstructuras = 0;
    } else {
      this.tiempoSinEstructuras++;
      if (this.tiempoSinEstructuras >= this.tiempoLimiteSinEstructuras) {
        this.reiniciarUniverso();
        this.tiempoSinEstructuras = 0;
      }
    }
    const recompensa = this.calcularRecompensa(estadoActual.nodos);
    this.actualizarPesos(recompensa);
  }

  private hayEstructuras(nodos: NodoInterface[]): boolean {
    return this.detectarEstructuras(nodos) > 0;
  }
}
