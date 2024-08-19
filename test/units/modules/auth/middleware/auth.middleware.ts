import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { Config } from '@modules/config/ports/config';
import {
  ContextKeysProps,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import TokenService from '@modules/shared/domain/token.service';
import { UserRepository } from '@modules/user/application/repositories/user.repository';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

class UnauthorizedError extends BaseError {
  constructor() {
    super(['Unauthorized'], HttpStatusCode.NOT_FOUND);
    this.name = 'AuthMiddlewareUnauthorizedError';
  }
}

// TODO: criar middleware do nest no infra
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly contextStorageService: ContextStorageService,
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.toString().split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedError();
    }

    const payloadOrError = await this.tokenService.verifyAsync({
      token: accessToken,
      secretKey: this.config.getAuthenticationConfig().secretKey,
    });

    if (payloadOrError.isLeft()) {
      throw new UnauthorizedError();
    }

    const store = new Map<
      keyof ContextKeysProps,
      ContextKeysProps[keyof ContextKeysProps]
    >();

    const user = await this.userRepository.findById(
      payloadOrError.value.userId,
    );

    if (!user) {
      throw new UnauthorizedError();
    }

    store.set('currentUser', user);
    this.contextStorageService.run(store, () => {
      next();
    });
  }
}
