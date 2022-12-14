import { Provider } from '@nestjs/common';
import { GalleryRepo } from './GalleryRepo';

export const GALLERY_REPO = 'GALLERY_REPO';

export const GalleryRepoProvider: Provider = {
  provide: GALLERY_REPO,
  useClass: GalleryRepo,
};
