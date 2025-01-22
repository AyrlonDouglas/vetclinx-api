import {
  Context,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { AsyncLocalStorage } from 'async_hooks';

describe('ContextStorageService', () => {
  const makeSut = () => {
    const store = new Context();
    const userMock = User.create({
      email: Email.create('teste@teste.com').value as Email,
      name: 'teste name',
      password: Password.create('PassPass@1').value as Password,
      username: 'username test',
      id: '123123',
      birthDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date(),
      institution: 'UFRPE',
      status: UserStatus.active,
      userType: UserType.student,
    }).value as User;

    store.set('currentUser', userMock);

    const asyncLocalStorage = new AsyncLocalStorage<Context>();
    const sut = new ContextStorageService(asyncLocalStorage);

    return { sut, asyncLocalStorage, store };
  };

  describe('ContextStorageService.run', () => {
    test('Should save in asyncLocalStorage when call run with storage', async () => {
      const { sut, asyncLocalStorage, store } = makeSut();

      await sut.run(store, () => {
        expect(asyncLocalStorage.getStore()).toEqual(store);
      });
    });
  });

  describe('ContextStorageService.getStore', () => {
    test('Should return context when getStore is called', async () => {
      const { sut, store } = makeSut();

      await sut.run(store, () => {
        expect(sut.getStore()).toEqual(store);
      });
    });
  });

  describe('ContextStorageService.get', () => {
    test('Should return content choose in key', async () => {
      const { sut, store } = makeSut();

      await sut.run(store, () => {
        expect(sut.get('currentUser')).toEqual(store.get('currentUser'));
      });
    });
  });

  describe('ContextStorageService.set', () => {
    test('Should modify content in context', async () => {
      const { sut, store } = makeSut();

      await sut.run(store, () => {
        const userMock2 = User.create({
          email: Email.create('teste2@teste.com').value as Email,
          name: 'teste name2',
          password: Password.create('PassPass@12').value as Password,
          username: 'username2 test',
          id: '321321',
          birthDate: new Date('1996-04-16'),
          country: 'bra',
          graduationDate: new Date(),
          institution: 'UFRPE',
          status: UserStatus.active,
          userType: UserType.student,
        }).value as User;

        sut.set('currentUser', userMock2);

        expect(sut.get('currentUser')).toEqual(userMock2);
      });
    });
  });
});
