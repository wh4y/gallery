import { IsBoolean, IsOptional } from 'class-validator';

export class EditGalleryParamsDto {
  @IsBoolean()
  @IsOptional()
  public readonly isPrivate?: boolean;
}
