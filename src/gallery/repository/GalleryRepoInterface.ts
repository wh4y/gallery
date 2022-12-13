import { Gallery } from '../entity/Gallery';

export interface GalleryRepoInterface {
  saveGallery(gallery: Gallery): Promise<void>;
  findGalleryById(id: number): Promise<Gallery>;
}
