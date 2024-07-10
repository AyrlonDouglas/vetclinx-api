class UsernameTakenError extends Error {
  constructor(username: string) {
    super(`The username ${username} was already taken`);
    this.name = 'UsernameTakenError';
  }
}

class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`The email ${email} associated for this account already exists`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export default {
  usernameTakenError: UsernameTakenError,
  emailAlreadyExistsError: EmailAlreadyExistsError,
};
