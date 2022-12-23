import { Gallery } from '../entity/Gallery';

export type IncludeOptions = {
  owner?: boolean;
  mediaFiles?: boolean;
};

type GalleryWithoutConstParams = Omit<
  Partial<Gallery>,
  'id' | 'owner' | 'mediaFiles'
>;

export type EditGalleryParamsOptions = {
  [P in keyof GalleryWithoutConstParams]: GalleryWithoutConstParams[P] extends Function
    ? never
    : GalleryWithoutConstParams[P];
};
