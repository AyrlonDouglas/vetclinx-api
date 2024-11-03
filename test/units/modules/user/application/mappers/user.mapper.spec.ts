// import {
//   UserDTO,
//   UserMapper,
// } from '@modules/user/application/mappers/user.mapper';
import User, {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import Email from '@modules/user/domain/valueObjects/email/email.valueObject';
import Password from '@modules/user/domain/valueObjects/password/password.valueObject';
import { UserDTO, UserMapper } from '@modules/user/infra/mapper/user.mapper';
import { Types } from 'mongoose';

describe('UserMapper', () => {
  const makeSut = () => {
    const userMock = User.create({
      email: Email.create('teste@teste.com').value as Email,
      name: 'name teste',
      username: 'username test',
      password: Password.create('PassValid@1').value as Password,
      id: '6703105ec83be2bc35b970c6',
      birthDate: new Date('1996-04-16'),
      country: 'bra',
      graduationDate: new Date('2021-08-17'),
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
        birthDate: userMock.props.birthDate,
        country: userMock.props.country,
        graduationDate: userMock.props.graduationDate,
        institution: userMock.props.institution,
        status: userMock.props.status,
        userType: userMock.props.userType,
        phoneNumber: userMock.props.phoneNumber,
        professionalRegistration: userMock.props.professionalRegistration,
        specialization: userMock.props.specialization,
      });
    });
  });

  describe('UserMapper.toDomain()', () => {
    test('Should return User', () => {
      const { sut, userMock } = makeSut();

      const result = sut.toDomain({
        _id: new Types.ObjectId(userMock.props.id),
        birthDate: userMock.props.birthDate,
        country: userMock.props.country,
        email: userMock.props.email.value,
        graduationDate: userMock.props.graduationDate,
        institution: userMock.props.institution,
        name: userMock.props.name,
        password: userMock.props.password.value,
        status: userMock.props.status,
        username: userMock.props.username,
        userType: userMock.props.userType,
        phoneNumber: userMock.props.phoneNumber,
        professionalRegistration: userMock.props.professionalRegistration,
        specialization: userMock.props.specialization,
      });
      console.log(result.props.graduationDate);
      console.log(userMock.props.graduationDate);
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
