import { Cookie } from '../../../common/cookie/Cookie';
import { CookieOptions } from 'express';

export class RefreshTokenCookie extends Cookie {
  public static REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(public readonly val: string) {
    super(RefreshTokenCookie.REFRESH_TOKEN, val, RefreshTokenCookieOptions);
  }
}

const RefreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
};
