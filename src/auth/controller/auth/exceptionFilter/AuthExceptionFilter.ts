import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { IncorrectPassOrEmailException } from '../../../service/auth/exceptions';
import { UserAlreadyExistsException } from '../../../../user/service/exceptions';

@Catch(IncorrectPassOrEmailException, UserAlreadyExistsException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let httpException: HttpException = new InternalServerErrorException();

    if (exception instanceof UserAlreadyExistsException)
      httpException = new ConflictException(exception.message);
    if (exception instanceof IncorrectPassOrEmailException)
      httpException = new BadRequestException(exception.message);

    res.status(httpException.getStatus()).json(httpException.getResponse());
  }
}
