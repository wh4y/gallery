import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 } from 'uuid';
import { FileInterceptor as ExpressFileInterceptor } from '@nestjs/platform-express';
import { NestInterceptor, Type } from '@nestjs/common';
import { FileTypes } from '../../core/FileTypes';

export const FileInterceptor = (
  type: FileTypes,
  fieldName: string,
): Type<NestInterceptor> =>
  ExpressFileInterceptor(fieldName, {
    storage: diskStorage({
      destination: `./upload/${type.toLowerCase()}s`,
      filename: (req, file, cb) => {
        const filename =
          path.parse(file.originalname).name.replace(/\s/g, '') + '_' + v4();
        file.filename;
        const extension = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      },
    }),
  });
