import {
  Context,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class InitContextStoreMiddleware implements NestMiddleware {
  constructor(private readonly contextStorageService: ContextStorageService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const store = new Context();

    this.contextStorageService.run(store, () => {
      next();
    });
  }
}
