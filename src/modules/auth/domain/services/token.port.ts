import { Either } from '@shared/core/either';
import Token from '../valueObjects/token/token.objectValue';
import { InspetorError } from '@shared/core/inspetor';

export default interface TokenPort {
  create: (
    payload: any,
    secretKey?: string,
    config?: signConfig,
  ) => Either<InspetorError, Token>;
  // verify: (token: string, secretKey: string) => void;
}

type signConfig = {
  expiresIn: string;
  algorithm: string;
};
