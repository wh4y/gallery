import { Cookie } from '../../../common/cookie/Cookie';
import { CookieOptions } from 'express';

export class AccessTokenCookie extends Cookie {
  public static ACCESS_TOKEN = 'ACCESS_TOKEN';

  constructor(public readonly val: string) {
    super(AccessTokenCookie.ACCESS_TOKEN, val, AccessTokenCookieOptions);
  }
}

const AccessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
};
