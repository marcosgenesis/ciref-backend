import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from "@nestjs/axios";
import { RepoModule } from './repo/repo.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [HttpModule, RepoModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
