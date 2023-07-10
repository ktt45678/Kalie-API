import { FastifyInstance } from 'fastify';

import { indexController } from './routes/index/index.js';
import { clipdropController } from './routes/clipdrop/index.js';

export async function routing(fastify: FastifyInstance) {
  fastify.register(indexController, { prefix: '/' });
  fastify.register(clipdropController, { prefix: '/clipdrop' });
}