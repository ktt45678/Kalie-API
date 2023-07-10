import 'dotenv/config';
import 'reflect-metadata';
import Fastify from 'fastify';

import { PORT } from './config.js';
import { routing } from './routing.js';

const fastify = Fastify({
  logger: true
});

fastify.register(routing);

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}