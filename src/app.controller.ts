import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('refact')
  extractRefacts(@Body() body): Promise<any> {
    return this.appService.extractRefacts(body.name, body.url);
  }

  @Post('payload')
  a(@Body() body) {
    return true;
    // return this.appService.extractRefacts(body.name, body.url);
  }

  @Get('info')
  getRefactsInfo(@Query('url') url: string): Promise<any> {
    return this.appService.getRefactsInfo(url);
  }

  @Get('user/:username')
  getUserFromUsername(@Param(':username') username: string): Promise<any> {
    return this.appService.getUser(username);
  }

  @Get('refacts/users')
  getRefactsAndUsers(@Query('repoUrl') repoUrl: string): Promise<any> {
    return this.appService.getUsersAndRefacts(repoUrl);
  }

  @Post('duel')
  getDuelBetweenUsers(@Body() body: any): Promise<any> {
    return this.appService.getDuelBetweenUsers(
      body.repoUrl,
      body.user1,
      body.user2,
    );
  }

  @Get('refactPoints')
  getRefactsPointsByType(@Query('repoUrl') repoUrl: string): Promise<any> {
    return this.appService.getRefactPointsByType(repoUrl);
  }
}
