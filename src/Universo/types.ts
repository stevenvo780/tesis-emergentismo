export enum ValoresSistema {
  FILAS = 20,
  COLUMNAS = 30,
  PROBABILIDAD_VIDA_INICIAL = 0.8,
  LIMITE_EDAD = 10,
  LIMITE_TIEMPO_RELACION = 10,
  DISTANCIA_RELACION = 3,
}

export interface NodoInterface {
  id: string;
  memoria: Memoria;
}

export interface Relacion {
  nodoId: string;
  cargaCompartida: number;
}

export interface Memoria {
  cargas: number;
  vivo: boolean;
  propiedades: number[];
  edad: number;
  procesos: Procesos;
  relaciones: Relacion[];
}

export interface Procesos {
  materiaEntrante: (nodo: NodoInterface, propiedad: number) => number;
  cambioDeEstado: (nodo: NodoInterface, propiedad: number) => number;
  materiaSaliente: (nodos: NodoInterface[], index: number) => number;
  relacionarNodos: (nodo: NodoInterface, vecinos: NodoInterface[]) => void;
  intercambiarCargas: (nodoA: NodoInterface, nodoB: NodoInterface) => void;
}
