import {
  UserDTO,
  UserMapper,
} from '@modules/user/application/mappers/user.mapper';
import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';

describe('UserMapper', () => {
  const makeSut = () => {
    const userMock = User.create({
      email: Email.create('teste@teste.com').value as Email,
      name: 'name teste',
      username: 'username test',
      password: Password.create('PassValid@1').value as Password,
      id: '123456',
      brithDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date(),
      institution: 'UFRPE',
      status: UserStatus.active,
      userType: UserType.student,
    }).value as User;

    const sut = new UserMapper();

    return { sut, userMock };
  };

  describe('UserMapper.toPersistense()', () => {
    test('Should return plain object containing email, name, username and password', () => {
      const { sut, userMock } = makeSut();

      const result = sut.toPersistense(userMock);

      expect(result).toEqual({
        email: userMock.props.email.value,
        name: userMock.props.name,
        username: userMock.props.username,
        password: userMock.props.password.value,
      });
    });
  });

  describe('UserMapper.toDomain()', () => {
    test('Should return User', () => {
      const { sut, userMock } = makeSut();

      const result = sut.toDomain({
        email: userMock.props.email.value,
        id: userMock.props.id,
        name: userMock.props.name,
        password: userMock.props.password.value,
        username: userMock.props.username,
      });

      expect(result).toEqual(userMock);
    });
  });

  describe('UserMapper.toDTO()', () => {
    test('Should return instace of UserDTO', () => {
      const { sut, userMock } = makeSut();

      const result = sut.toDTO(userMock);

      expect(result).toBeInstanceOf(UserDTO);
      expect(result.email).toEqual(userMock.props.email.value);
      expect(result.id).toEqual(userMock.props.id);
      expect(result.name).toEqual(userMock.props.name);
      expect(result.username).toEqual(userMock.props.username);
    });
  });
});
