import { Gallery } from '../entity/Gallery';

export interface GalleryRepoInterface {
  save(gallery: Gallery): Promise<void>;
  findById(id: number): Promise<Gallery>;
}
