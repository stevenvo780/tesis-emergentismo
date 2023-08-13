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
  i: number,
  j: number,
): NodoInterface[] => {
  const indicesVecinos = [
    ((i - 1 + ValoresSistema.FILAS) % ValoresSistema.FILAS) *
      ValoresSistema.COLUMNAS +
      ((j - 1 + ValoresSistema.COLUMNAS) % ValoresSistema.COLUMNAS),
    ((i - 1 + ValoresSistema.FILAS) % ValoresSistema.FILAS) *
      ValoresSistema.COLUMNAS +
      j,
    ((i - 1 + ValoresSistema.FILAS) % ValoresSistema.FILAS) *
      ValoresSistema.COLUMNAS +
      ((j + 1) % ValoresSistema.COLUMNAS),
    i * ValoresSistema.COLUMNAS +
      ((j - 1 + ValoresSistema.COLUMNAS) % ValoresSistema.COLUMNAS),
    i * ValoresSistema.COLUMNAS + ((j + 1) % ValoresSistema.COLUMNAS),
    ((i + 1) % ValoresSistema.FILAS) * ValoresSistema.COLUMNAS +
      ((j - 1 + ValoresSistema.COLUMNAS) % ValoresSistema.COLUMNAS),
    ((i + 1) % ValoresSistema.FILAS) * ValoresSistema.COLUMNAS + j,
    ((i + 1) % ValoresSistema.FILAS) * ValoresSistema.COLUMNAS +
      ((j + 1) % ValoresSistema.COLUMNAS),
  ];
  return indicesVecinos.map((indice) => nodos[indice]);
};

const procesoDeVidaOMuerte = (nodo: NodoInterface, vecinosVivos: number) => {
  if (nodo.memoria.vivo === true) {
    nodo.memoria.edad++;
    if (
      vecinosVivos < 2 ||
      vecinosVivos > 3 ||
      nodo.memoria.edad > ValoresSistema.LIMITE_EDAD
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
  vecinos.forEach((vecino) => {
    if (nodo.memoria.vivo && vecino.memoria.vivo) {
      const relacionExistente = nodo.memoria.relaciones.find(
        (rel) => rel.nodoId === vecino.id,
      );
      if (!relacionExistente) {
        nodo.memoria.relaciones.push({
          nodoId: vecino.id,
          cargaCompartida: 0, // Puedes establecer un valor inicial aquí
        }); // Crear nueva relación
      }
    } else {
      nodo.memoria.relaciones = nodo.memoria.relaciones.filter(
        (rel) => rel.nodoId !== vecino.id,
      ); // Romper relación
    }
  });
};

export const siguienteGeneracion = (nodos: NodoInterface[]) => {
  const nuevaGeneracion: NodoInterface[] = nodos.map((nodo) => ({
    ...nodo,
    memoria: { ...nodo.memoria, propiedades: [...nodo.memoria.propiedades] },
  }));
  for (let i = 0; i < ValoresSistema.FILAS; i++) {
    for (let j = 0; j < ValoresSistema.COLUMNAS; j++) {
      const nodo = nuevaGeneracion[i * ValoresSistema.COLUMNAS + j];
      const vecinos = obtenerVecinos(nodos, i, j);
      const vecinosVivos = vecinos.filter(
        (vecino) => vecino.memoria.vivo === true,
      ).length;

      procesoDeVidaOMuerte(nodo, vecinosVivos); // Proceso de vida o muerte

      relacionarNodos(nodo, vecinos); // Relacionar nodos

      vecinos.forEach((vecino) => {
        if (
          (nodo.memoria.cargas < 0 && vecino.memoria.cargas > 0) ||
          (nodo.memoria.cargas > 0 && vecino.memoria.cargas < 0)
        ) {
          intercambiarCargas(nodo, vecino); // Intercambiar cargas
          const relacionExistente = nodo.memoria.relaciones.find(
            (rel) => rel.nodoId === vecino.id,
          );
          if (!relacionExistente) {
            nodo.memoria.relaciones.push({
              nodoId: vecino.id,
              cargaCompartida: 0,
            });
          }
        }
      });
    }
  }
  nodos.length = 0;
  nodos.push(...nuevaGeneracion);
  //console.log(JSON.stringify(nodos, null, 4));
  return nodos;
};
