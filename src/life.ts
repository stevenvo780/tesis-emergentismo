enum ValoresSistema {
  FILAS = 50,
  COLUMNAS = 80,
  PROBABILIDAD_VIDA_INICIAL = 0.8,
  LIMITE_EDAD = 50,
}

export interface NodoInterface {
  memoria: Memoria;
}

interface Memoria {
  propiedades: number[];
  edad: number;
  subMemoria: NodoInterface[];
  procesos: Procesos;
  relacion: NodoInterface[];
}

interface Procesos {
  materiaEntrante: (nodo: NodoInterface, propiedad: number) => number;
  cambioDeEstado: (nodo: NodoInterface, propiedad: number) => number;
  materiaSaliente: (index: number) => number;
  relacionar: (nodo: NodoInterface) => NodoInterface;
}

const materiaEntrante = (nodo: NodoInterface, propiedad: number): number => {
  nodo.memoria.propiedades.push(propiedad);
  return nodo.memoria.propiedades.length;
};

const cambioDeEstado = (nodo: NodoInterface, propiedad: number): number => {
  nodo.memoria.propiedades.push(propiedad);
  return propiedad + 1;
};

const relacionar = (nodo: NodoInterface): NodoInterface => {
  nodo.memoria.relacion.push(nodo);
  return nodo;
};

const materiaSaliente = (index: number): number => {
  nodos.splice(index, 1);
  return nodos.length;
};

const nodos: NodoInterface[] = [];

const determinacionesDelSistema = () => {
  for (let i = 0; i < ValoresSistema.FILAS; i++) {
    for (let j = 0; j < ValoresSistema.COLUMNAS; j++) {
      const nodo: NodoInterface = {
        memoria: {
          propiedades: [
            Math.random() > ValoresSistema.PROBABILIDAD_VIDA_INICIAL ? 1 : 0,
          ],
          edad: 0,
          subMemoria: [],
          procesos: {
            materiaEntrante,
            cambioDeEstado,
            materiaSaliente,
            relacionar,
          },
          relacion: [],
        },
      };
      nodos.push(nodo);
    }
  }
};

const procesoDeAlimentacion = (nodo: NodoInterface, vecinosVivos: number) => {
  if (nodo.memoria.propiedades[0] === 1) {
    nodo.memoria.edad++;
    if (
      vecinosVivos < 2 ||
      vecinosVivos > 3 ||
      nodo.memoria.edad > ValoresSistema.LIMITE_EDAD
    ) {
      nodo.memoria.propiedades[0] = 0;
      nodo.memoria.edad = 0;
    }
  } else {
    if (vecinosVivos === 3) {
      nodo.memoria.propiedades[0] = 1;
      nodo.memoria.edad = 1;
    }
  }
};

const vecinosVivos = (i: number, j: number) => {
  const vecinos = [
    nodos[
      ((i - 1 + ValoresSistema.FILAS) % ValoresSistema.FILAS) *
        ValoresSistema.COLUMNAS +
        ((j - 1 + ValoresSistema.COLUMNAS) % ValoresSistema.COLUMNAS)
    ]?.memoria.propiedades[0] ?? 0,
    nodos[
      ((i - 1 + ValoresSistema.FILAS) % ValoresSistema.FILAS) *
        ValoresSistema.COLUMNAS +
        j
    ]?.memoria.propiedades[0] ?? 0,
    nodos[
      ((i - 1 + ValoresSistema.FILAS) % ValoresSistema.FILAS) *
        ValoresSistema.COLUMNAS +
        ((j + 1) % ValoresSistema.COLUMNAS)
    ]?.memoria.propiedades[0] ?? 0,
    nodos[
      i * ValoresSistema.COLUMNAS +
        ((j - 1 + ValoresSistema.COLUMNAS) % ValoresSistema.COLUMNAS)
    ]?.memoria.propiedades[0] ?? 0,
    nodos[i * ValoresSistema.COLUMNAS + ((j + 1) % ValoresSistema.COLUMNAS)]
      ?.memoria.propiedades[0] ?? 0,
    nodos[
      ((i + 1) % ValoresSistema.FILAS) * ValoresSistema.COLUMNAS +
        ((j - 1 + ValoresSistema.COLUMNAS) % ValoresSistema.COLUMNAS)
    ]?.memoria.propiedades[0] ?? 0,
    nodos[((i + 1) % ValoresSistema.FILAS) * ValoresSistema.COLUMNAS + j]
      ?.memoria.propiedades[0] ?? 0,
    nodos[
      ((i + 1) % ValoresSistema.FILAS) * ValoresSistema.COLUMNAS +
        ((j + 1) % ValoresSistema.COLUMNAS)
    ]?.memoria.propiedades[0] ?? 0,
  ];
  return vecinos.reduce((a, b) => a + b);
};

const siguienteGeneracion = () => {
  const nuevaGeneracion: NodoInterface[] = nodos.map((nodo) => ({
    ...nodo,
    memoria: { ...nodo.memoria, propiedades: [...nodo.memoria.propiedades] },
  }));
  for (let i = 0; i < ValoresSistema.FILAS; i++) {
    for (let j = 0; j < ValoresSistema.COLUMNAS; j++) {
      const totalVecinosVivos = vecinosVivos(i, j);
      procesoDeAlimentacion(
        nuevaGeneracion[i * ValoresSistema.COLUMNAS + j],
        totalVecinosVivos,
      );
    }
  }
  nodos.length = 0;
  nodos.push(...nuevaGeneracion);
};

determinacionesDelSistema();

export const obtenerEstadoActualizado = () => {
  siguienteGeneracion();
  return nodos;
};
