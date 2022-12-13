import { Repository } from 'typeorm';
import { Gallery } from '../entity/Gallery';
import { GalleryRepoInterface } from './GalleryRepoInterface';

export class GalleryRepo
  extends Repository<Gallery>
  implements GalleryRepoInterface
{
  public async saveGallery(gallery: Gallery): Promise<void> {
    await this.save(gallery);
  }

  public async findGalleryById(id: number): Promise<Gallery> {
    return (await this.findOneBy({ id })) as Gallery;
  }
}
