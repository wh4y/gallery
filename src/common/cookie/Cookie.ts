import { CookieOptions } from 'express';

export class Cookie {
  constructor(
    public readonly name: string,
    public readonly val: string,
    public readonly options: CookieOptions,
  ) {}
}
