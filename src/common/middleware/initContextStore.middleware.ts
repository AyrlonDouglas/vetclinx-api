import {
  ContextKeysProps,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class InitContextStoreMiddleware implements NestMiddleware {
  constructor(private readonly contextStorageService: ContextStorageService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const store = new Map<
      keyof ContextKeysProps,
      ContextKeysProps[keyof ContextKeysProps]
    >();

    this.contextStorageService.run(store, () => {
      next();
    });
  }
}
