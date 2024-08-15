import User from '@modules/user/domain/entities/user.entity';
import { AsyncLocalStorage } from 'async_hooks';

export class ContextStorageService {
  constructor(private readonly als: AsyncLocalStorage<Context>) {}

  run(store: Context, callback: () => void): void {
    this.als.run(store, callback);
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

export type Context = Map<
  keyof ContextKeysProps,
  ContextKeysProps[keyof ContextKeysProps]
>;

export type ContextKeysProps = {
  currentUser: User;
};
