import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Weight } from './DTOs/Weights';

@Injectable()
export class WeightsService {
  constructor(private prisma: PrismaService) {}

  async newRepoWeights(
    repoUrl,
    {
      add,
      change,
      extract,
      inline,
      merge,
      modify,
      move,
      remove,
      rename,
      replace,
      split,
    }: Weight,
  ): Promise<any> {
    const findRepo = await this.prisma.repo.findFirst({
      where: { repoUrl },
    });

    if (!findRepo)
      throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

    await this.prisma.weights.create({
      data: {
        add,
        change,
        extract,
        inline,
        merge,
        modify,
        move,
        remove,
        rename,
        replace,
        split,
        repoId: findRepo.id,
      },
    });
  }
}
