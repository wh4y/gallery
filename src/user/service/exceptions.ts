export class UserAlreadyExistsException extends Error {
  public static readonly message = 'User already exists!';

  constructor() {
    super(UserAlreadyExistsException.message);
  }
}

export class UserDoesntExistException extends Error {
  public static readonly message = "User doesn't exist!";

  constructor() {
    super(UserDoesntExistException.message);
  }
}
