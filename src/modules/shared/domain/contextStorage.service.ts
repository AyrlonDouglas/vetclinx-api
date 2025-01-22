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

  get<K extends keyof ContextStore>(key: K): ContextStore[K] | null {
    const store = this.getStore();
    return store.get(key) ?? null;
  }

  set<K extends keyof ContextStore>(key: K, value: ContextStore[K]) {
    const store = this.getStore();
    store.set(key, value);
  }
}

type ContextStore = {
  currentUser?: User;
  session?: ClientSession;
  postgreQueryRunner?: QueryRunner;
};
export class Context {
  private store: ContextStore = {};

  set<K extends keyof ContextStore>(key: K, value: ContextStore[K]) {
    this.store[key] = value;
  }

  get<K extends keyof ContextStore>(key: K): ContextStore[K] | undefined {
    return this.store[key];
  }
}
