import {
  UserStatus,
  UserType,
} from '@modules/user/domain/entities/user.entity';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './baseEntity.';
import { CountriesUtil } from '@common/constants/countries';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserStatus.active, type: 'enum', enum: UserStatus })
  status: keyof typeof UserStatus;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  birthDate: Date;

  @Column({ type: 'enum', enum: UserType })
  userType: keyof typeof UserType;

  @Column()
  institution: string;

  @Column()
  graduationDate: Date;

  @Column({ nullable: true })
  professionalRegistration?: string;

  @Column()
  country: string;

  @BeforeInsert()
  @BeforeUpdate()
  validateProfessionalRegistration() {
    if (
      this.userType === UserType.veterinarian &&
      !this.professionalRegistration
    ) {
      throw new Error(
        'Professional registration is required for veterinarians.',
      );
    }

    if (!CountriesUtil.getInstance().getNameByAlpha3(this.country)) {
      throw new Error('Country registration is invalid');
    }
  }
}
