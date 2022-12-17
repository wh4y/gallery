import { Repository } from 'typeorm';
import { Gallery } from '../entity/Gallery';
import { GalleryRepoInterface } from './GalleryRepoInterface';
import { InjectRepository } from '@nestjs/typeorm';

export class GalleryRepo implements GalleryRepoInterface {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepo: Repository<Gallery>,
  ) {}

  public async save(gallery: Gallery): Promise<void> {
    await this.galleryRepo.save(gallery);
  }

  public async findById(id: number): Promise<Gallery> {
    return (await this.galleryRepo.findOneBy({ id })) as Gallery;
  }
}
