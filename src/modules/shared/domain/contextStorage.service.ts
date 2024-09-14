import User from '@modules/user/domain/entities/user.entity';
import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession } from 'mongoose';

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

  get(key: keyof ContextKeysProps) {
    const store = this.getStore();
    return store.get(key) ?? null;
  }

  set(
    key: keyof ContextKeysProps,
    value: ContextKeysProps[keyof ContextKeysProps],
  ) {
    const store = this.getStore();

    store.set(key, value);
  }
}

export type Context = Map<keyof ContextKeysProps, any>;

export type ContextKeysProps = {
  currentUser: User;
  session?: ClientSession;
};
