import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * CONSTANTS | UTILS
 */
// import { userAgent } from "../utils/app"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: FastifyRequest, res: FastifyReply, next) {
    try {
      // const uAgent = await userAgent(req)
      /** LOGGING */
      // await this.itemsService.logging(JSON.stringify(req.body), uAgent, req.token)
      next();
    } catch (error) {
      console.log(error);
      return res.status(404);
    }
  }
}
