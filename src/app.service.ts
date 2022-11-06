import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private api: HttpService, private prisma: PrismaService) {}
  async extractRefacts(name: string, url: string): Promise<any> {
    try {
      const findRepo = await this.prisma.repo.findFirst({
        where: { repoUrl: url },
      });

      if (!findRepo)
        throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

      const response = await this.api.axiosRef.post(
        'http://172.28.224.1:8080/refact/all',
        { name, url, branch: 'master' },
      );

      const results = await Promise.all(
        response.data.map((item) =>
          this.api.axiosRef.get(
            `https://api.github.com/repos/marcosgenesis/${name}/commits/${item.commitId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.API_GITHUB_AUTH}`,
              },
            },
          ),
        ),
      );
      const authors = results.map((i) => ({
        login: i.data.author.login,
        avatar: i.data.author.avatar_url,
      }));

      const formatted = response.data.map((refact, index) => {
        const leftSideLocations = refact.leftSideLocations.map((location) => ({
          filePath: location.filePath,
          side: 'left',
        }));
        const rightSideLocations = refact.rightSideLocations.map(
          (location) => ({
            filePath: location.filePath,
            side: 'right',
          }),
        );
        delete refact.rightSideLocations;
        delete refact.leftSideLocations;
        return {
          ...refact,
          ...authors[index],
          locations: [...leftSideLocations, ...rightSideLocations],
        };
      });

      formatted.forEach(async (element) => {
        const findRefact = await this.prisma.refact.findFirst({
          where: {
            AND: [{ repoId: findRepo.id }, { uuid_id: element.id }],
          },
        });
        if (!findRefact) {
          await this.prisma.refact
            .create({
              data: {
                repoId: findRepo.id,
                uuid_id: element.id,
                type: element.type,
                description: element.description,
                login: element.login,
                avatar: element.avatar,
                locations: { createMany: { data: element.locations } },
              },
            })
            .catch((e) => console.log(e));
        }
      });
      return formatted;
    } catch (error) {
      console.log(error);
    }
  }

  async getRefactsInfo(url: string): Promise<any> {
    try {
      const findRepo = await this.prisma.repo.findFirst({
        where: { repoUrl: url },
      });

      if (!findRepo)
        throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

      const results = await this.prisma.refact.findMany({
        where: { repoId: findRepo.id },
      });
      /**
       * add - 11
       * remove - 11
       * move - 10
       * rename - 9
       * change - 9
       * extract - 8
       * split - 6
       * merge - 5
       * replace - 5
       * modify - 4
       * inline - 4
       */
      const a = results.reduce((acc, i) => {
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
  async getRefactPointsByType(url: string): Promise<any> {
    try {
      const findRepo = await this.prisma.repo.findFirst({
        where: { repoUrl: url },
        include: {
          weights: {
            select: {
              add: true,
              remove: true,
              move: true,
              rename: true,
              change: true,
              extract: true,
              split: true,
              merge: true,
              replace: true,
              modify: true,
              inline: true,
            },
          },
        },
      });

      if (!findRepo)
        throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

      console.log(findRepo);

      const results = await this.prisma.refact.findMany({
        where: { repoId: findRepo.id },
      });

      const a = results.reduce((acc, i) => {
        const findWeight = Object.entries(findRepo.weights[0]).find((el) => {
          return i.type.toLocaleLowerCase().includes(el[0]);
        });
        const weight = !!findWeight ? findWeight[1] : 1;
        console.log(weight);

        if (acc[i?.type]) {
          acc[i?.type] += 1 * weight;
          return acc;
        }
        acc[i?.type] = 1 * weight;
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

  async getUsersAndRefacts(repoUrl: string): Promise<any> {
    const findRepo = await this.prisma.repo.findFirst({
      where: { repoUrl },
    });

    if (!findRepo)
      throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

    const results = await this.prisma.refact.findMany({
      select: { login: true, avatar: true, type: true },
      where: { repoId: findRepo.id },
    });

    const data = results.reduce((acc, it) => {
      if (acc[it.login]) {
        if (acc[it.login].hasOwnProperty(it.type)) {
          acc[it.login][it.type] += 1;
          return acc;
        }
        acc[it.login][it.type] = 1;
        return acc;
      }
      acc[it.login] = {};
      acc[it.login][it.type] = 1;
      return acc;
    }, {});
    return data;
  }

  async getDuelBetweenUsers(
    repoUrl: string,
    user1: string,
    user2: string,
  ): Promise<any> {
    const findRepo = await this.prisma.repo.findFirst({
      where: { repoUrl },
    });

    if (!findRepo)
      throw new HttpException('Repo not found', HttpStatus.BAD_REQUEST);

    const results = await this.prisma.refact.findMany({
      select: { login: true, avatar: true, type: true },
      where: {
        repoId: findRepo.id,
        OR: [{ login: { contains: user1 } }, { login: { contains: user2 } }],
      },
    });

    const data = results.reduce((acc, it) => {
      if (acc[it.login]) {
        if (acc[it.login].hasOwnProperty(it.type)) {
          acc[it.login][it.type] += 1;
          return acc;
        }
        acc[it.login][it.type] = 1;
        return acc;
      }
      acc[it.login] = {};
      acc[it.login][it.type] = 1;
      return acc;
    }, {});
    return data;
  }
}
