import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private api: HttpService, private prisma: PrismaService) {}
  async extractRefacts(name: string, url: string): Promise<any> {
    try {
      // const findRepo = await this.prisma.repo.findFirst({
      //   where: { repoUrl: url },
      // });

      // if (!findRepo)
      //   throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

      const response = await this.api.axiosRef.post(
        'http://localhost:8080/refact/all',
        { name, url, branch: 'master' },
      );
      // console.log(response);

      return response.data;

      // formatted.forEach(async (element) => {
      //   const findRefact = await this.prisma.refact.findFirst({
      //     where: {
      //       repoId: findRepo.id,
      //       type: element.type,
      //       description: element.description,
      //       filePath: element.rightSideLocations[0].filePath,
      //     },
      //   });
      //   if (!findRefact) {
      //     await this.prisma.refact.create({
      //       data: {
      //         repoId: findRepo.id,
      //         type: element.type,
      //         description: element.description,
      //         filePath: element.rightSideLocations[0].filePath,
      //       },
      //     });
      //   }
      // });

      // return a;
    } catch (error) {
      console.log(error);
    }
  }

  async getRefactsInfo(url: string): Promise<any> {
    try {
      const data = await this.extractRefacts(url, url);

      const a = data.reduce((acc, i) => {
        if (acc[i?.type]) {
          acc[i?.type] += 1;
          return acc;
        }
        acc[i?.type] = 1;
        return acc;
      }, {});
      return a;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(username: string): Promise<any> {
    return this.prisma.user.findFirst({ where: { username } });
  }
}
