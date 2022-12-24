import { Gallery } from '../entity/Gallery';

type GalleryWithoutConstParams = Omit<
  Partial<Gallery>,
  'id' | 'owner' | 'mediaFiles'
>;

export type EditGalleryParamsOptions = {
  [P in keyof GalleryWithoutConstParams]: GalleryWithoutConstParams[P] extends Function
    ? never
    : GalleryWithoutConstParams[P];
};
