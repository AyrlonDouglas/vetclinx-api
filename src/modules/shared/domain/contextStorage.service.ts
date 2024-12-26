import User from '@modules/user/domain/entities/user.entity';
import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession } from 'mongoose';
import { QueryRunner } from 'typeorm';

export class ContextStorageService {
  constructor(private readonly als: AsyncLocalStorage<Context>) {}

  async run(store: Context, callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.als.run(store, () => {
        callback();
        resolve();
      });
    });
  }

  getStore() {
    return this.als.getStore();
  }

  private get(key: keyof ContextKeysProps) {
    const store = this.getStore();
    return store.get(key) ?? null;
  }

  private set(
    key: keyof ContextKeysProps,
    value: ContextKeysProps[keyof ContextKeysProps],
  ) {
    const store = this.getStore();

    store.set(key, value);
  }

  set currentUser(user: User) {
    this.set('currentUser', user);
  }

  get currentUser(): User {
    return this.get('currentUser');
  }

  set session(session: ClientSession) {
    this.set('session', session);
  }

  get session(): ClientSession {
    return this.get('session');
  }

  set postgreQueryRunner(queryRunner: QueryRunner) {
    this.set('postgreQueryRunner', queryRunner);
  }

  get postgreQueryRunner() {
    return this.get('postgreQueryRunner');
  }
}

export type Context = Map<keyof ContextKeysProps, any>;

export type ContextKeysProps = {
  currentUser: User;
  session?: ClientSession;
  postgreQueryRunner?: QueryRunner;
};
