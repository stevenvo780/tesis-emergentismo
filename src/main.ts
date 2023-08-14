import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Entrenador } from './Universo/entrenador'; // Asegúrate de importar la clase Entrenador desde la ubicación correcta

const entrenador = new Entrenador();

export const obtenerEstadoActualizado = () => {
  return entrenador.universo.obtenerEstadoActualizado(); // Accede al universo a través del entrenador
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3006);
}
bootstrap();
