import { ValoresSistema, NodoInterface } from './types';

export const materiaEntrante = (
  nodo: NodoInterface,
  propiedad: number,
): number => {
  nodo.memoria.propiedades.push(propiedad);
  return nodo.memoria.propiedades.length;
};

export const cambioDeEstado = (
  nodo: NodoInterface,
  propiedad: number,
): number => {
  nodo.memoria.propiedades.push(propiedad);
  return propiedad + 1;
};

export const materiaSaliente = (
  nodos: NodoInterface[],
  index: number,
): number => {
  nodos.splice(index, 1);
  return nodos.length;
};

export const crearNodo = (i: number, j: number): NodoInterface => {
  return {
    id: `nodo-${i}-${j}`,
    memoria: {
      cargas: Math.random() * 2 - 1,
      vivo:
        Math.random() > ValoresSistema.PROBABILIDAD_VIDA_INICIAL ? true : false,
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
};

export const intercambiarCargas = (
  nodoA: NodoInterface,
  nodoB: NodoInterface,
): void => {
  const totalCargas = nodoA.memoria.cargas + nodoB.memoria.cargas;
  const cargaCompartida = totalCargas / 2;
  nodoA.memoria.cargas = cargaCompartida;
  nodoB.memoria.cargas = cargaCompartida;

  // Actualizar la carga compartida en la relación
  const relacionA = nodoA.memoria.relaciones.find(
    (rel) => rel.nodoId === nodoB.id,
  );
  if (relacionA) relacionA.cargaCompartida = cargaCompartida;

  const relacionB = nodoB.memoria.relaciones.find(
    (rel) => rel.nodoId === nodoA.id,
  );
  if (relacionB) relacionB.cargaCompartida = cargaCompartida;
};

const obtenerVecinos = (
  nodos: NodoInterface[],
  valoresSistema: typeof ValoresSistema,
  i: number,
  j: number,
): NodoInterface[] => {
  const FILAS = valoresSistema.FILAS;
  const COLUMNAS = valoresSistema.COLUMNAS;

  const indicesVecinos = [
    ((i - 1 + FILAS) % FILAS) * COLUMNAS + ((j - 1 + COLUMNAS) % COLUMNAS),
    ((i - 1 + FILAS) % FILAS) * COLUMNAS + j,
    ((i - 1 + FILAS) % FILAS) * COLUMNAS + ((j + 1) % COLUMNAS),
    i * COLUMNAS + ((j - 1 + COLUMNAS) % COLUMNAS),
    i * COLUMNAS + ((j + 1) % COLUMNAS),
    ((i + 1) % FILAS) * COLUMNAS + ((j - 1 + COLUMNAS) % COLUMNAS),
    ((i + 1) % FILAS) * COLUMNAS + j,
    ((i + 1) % FILAS) * COLUMNAS + ((j + 1) % COLUMNAS),
  ];

  return indicesVecinos
    .filter((indice) => indice >= 0 && indice < nodos.length)
    .map((indice) => nodos[indice]);
};

const procesoDeVidaOMuerte = (
  nodo: NodoInterface,
  valoresSistema: typeof ValoresSistema,
  vecinosVivos: number,
) => {
  if (nodo.memoria.vivo === true) {
    nodo.memoria.edad++;
    if (
      vecinosVivos < 2 ||
      nodo.memoria.cargas === 0 ||
      nodo.memoria.edad > valoresSistema.LIMITE_EDAD
    ) {
      nodo.memoria.vivo = false;
      nodo.memoria.edad = 0;
    }
  } else {
    if (vecinosVivos === 3) {
      nodo.memoria.vivo = true;
      nodo.memoria.edad = 1;
    }
  }
};

export const relacionarNodos = (
  nodo: NodoInterface,
  vecinos: NodoInterface[],
) => {
  if (nodo.memoria.vivo) {
    vecinos.forEach((vecino) => {
      if (
        vecino &&
        vecino.memoria.vivo &&
        vecino.id !== nodo.id &&
        vecino.id > nodo.id
      ) {
        const relacionExistente = nodo.memoria.relaciones.find(
          (rel) => rel.nodoId === vecino.id,
        );
        if (!relacionExistente) {
          nodo.memoria.relaciones.push({
            nodoId: vecino.id,
            cargaCompartida: 0, // Puedes establecer un valor inicial aquí
          }); // Crear nueva relación
        }
      }
    });
  }

  // Reducir gradualmente la carga compartida y eliminar relaciones con carga cero
  if (nodo.memoria.vivo === false) {
    nodo.memoria.relaciones = nodo.memoria.relaciones.filter((rel) => {
      if (rel.cargaCompartida < 0)
        rel.cargaCompartida += nodo.memoria.vivo
          ? ValoresSistema.REDUCCION_CARGA / vecinos.length
          : ValoresSistema.REDUCCION_CARGA;
      if (rel.cargaCompartida > 0)
        rel.cargaCompartida -= nodo.memoria.vivo
          ? ValoresSistema.REDUCCION_CARGA / vecinos.length
          : ValoresSistema.REDUCCION_CARGA;
      if (rel.cargaCompartida === 0) {
        return false; // Eliminar la relación si la carga es cero o negativa
      }
      return true;
    });
  }
};

export const expandirEspacio = (
  nodos: NodoInterface[],
  valoresSistema: typeof ValoresSistema,
) => {
  // Añadir filas en la parte inferior
  for (let i = 0; i < valoresSistema.CRECIMIENTO_X; i++) {
    for (let j = 0; j < valoresSistema.COLUMNAS; j++) {
      const nodo: NodoInterface = crearNodo(valoresSistema.FILAS + i, j);
      nodos.push(nodo);
    }
  }

  // Añadir columnas a la derecha
  for (
    let i = 0;
    i < valoresSistema.FILAS + valoresSistema.CRECIMIENTO_X;
    i++
  ) {
    for (let j = 0; j < valoresSistema.CRECIMIENTO_Y; j++) {
      const nodo: NodoInterface = crearNodo(i, valoresSistema.COLUMNAS + j);
      nodos.push(nodo);
    }
  }

  // Actualizar los valores del sistema
  valoresSistema.FILAS += valoresSistema.CRECIMIENTO_X;
  valoresSistema.COLUMNAS += valoresSistema.CRECIMIENTO_Y;

  return nodos;
};

export const siguienteGeneracion = (
  nodos: NodoInterface[],
  valoresSistema: typeof ValoresSistema,
) => {
  const nuevaGeneracion: NodoInterface[] = nodos;
  for (let i = 0; i < ValoresSistema.FILAS; i++) {
    for (let j = 0; j < ValoresSistema.COLUMNAS; j++) {
      const nodo = nuevaGeneracion[i * ValoresSistema.COLUMNAS + j];
      const vecinos = obtenerVecinos(nodos, valoresSistema, i, j);
      const vecinosVivos = vecinos
        ? vecinos.filter((vecino) => {
            if (vecino) {
              return vecino.memoria?.vivo === true;
            }
          }).length
        : 0;
      procesoDeVidaOMuerte(nodo, valoresSistema, vecinosVivos); // Proceso de vida o muerte

      relacionarNodos(nodo, vecinos); // Relacionar nodos

      vecinos.forEach((vecino) => {
        if (
          (vecino && nodo.memoria.cargas < 0 && vecino.memoria.cargas > 0) ||
          (nodo.memoria.cargas > 0 && vecino.memoria.cargas < 0)
        ) {
          intercambiarCargas(nodo, vecino); // Intercambiar cargas
        }
      });
    }
  }
  //console.log(JSON.stringify(nodos, null, 4));
  return nuevaGeneracion;
};
