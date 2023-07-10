import 'dotenv/config';
import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import compress from '@fastify/compress';

import { PORT } from './config.js';
import { routing } from './routing.js';

const fastify = Fastify({
  logger: true
});

await fastify.register(compress, { global: true, threshold: 512 });

await fastify.register(cors, {
  origin: '*',
  methods: ['OPTION', 'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  optionsSuccessStatus: 204
});

await fastify.register(routing);

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}