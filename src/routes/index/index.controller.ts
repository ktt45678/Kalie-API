import { FastifyInstance } from 'fastify';

export async function indexController(fastify: FastifyInstance) {
  fastify.get('/', (request, reply) => {
    return { hello: 'world' };
  });
}