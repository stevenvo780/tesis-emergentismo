import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Universo } from './Universo/ruluat';

export const universo = new Universo();

export const obtenerEstadoActualizado = () => {
  return universo.obtenerEstadoActualizado();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3006);
}
bootstrap();
