class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`No user with the username ${username} was found`);
    this.name = 'UserNotFoundError';
  }
}

export default {
  userNotFoundError: UserNotFoundError,
};
