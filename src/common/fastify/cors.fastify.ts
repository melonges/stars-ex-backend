import { NestFastifyApplication } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';

export function bootstrapFastifyCors(app: NestFastifyApplication) {
  return app.register(cors, { origin: '*' });
}
