import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  AccessDeniedException,
  FileDoesntExistException,
  GalleryDoesntExistException,
} from '../../service/exception';

@Catch(
  GalleryDoesntExistException,
  FileDoesntExistException,
  AccessDeniedException,
)
export class GalleryExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let httpException: HttpException = new InternalServerErrorException();

    if (
      exception instanceof GalleryDoesntExistException ||
      exception instanceof FileDoesntExistException
    )
      httpException = new NotFoundException(exception.message);
    if (exception instanceof AccessDeniedException)
      httpException = new ForbiddenException(exception.message);

    res.status(httpException.getStatus()).json(httpException.getResponse());
  }
}
