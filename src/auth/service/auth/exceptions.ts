export class IncorrectPassOrEmailException extends Error {
  public static readonly message = 'Incorrect password or email!';

  constructor() {
    super(IncorrectPassOrEmailException.message);
  }
}
