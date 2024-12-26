import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryRunnerMiddleware implements NestMiddleware {
  constructor(
    private readonly contextStorageService: ContextStorageService,
    private readonly dataSource: DataSource,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    this.contextStorageService.postgreQueryRunner = queryRunner;

    res.on('finish', async () => {
      await queryRunner.release();
    });

    next();
  }
}
