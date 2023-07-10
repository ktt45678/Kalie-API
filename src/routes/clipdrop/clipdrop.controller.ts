import { FastifyInstance, FastifyRequest } from 'fastify';

import { CreateImageDto, createImageSchema } from './dto/index.js';
import { clipdropService } from './clipdrop.service.js';

export async function clipdropController(fastify: FastifyInstance) {
  fastify.post('/stable-diffusion', { schema: { body: createImageSchema } },
    async (request: FastifyRequest<{ Body: CreateImageDto }>, reply) => {
      const result = await clipdropService.createImages(request.body);
      return { data: result };
    }
  );
}