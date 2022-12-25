import { IsArray, IsNumber } from 'class-validator';

export class DeleteFilesDto {
  @IsArray({ each: true })
  @IsNumber()
  fileIds: number[];
}
