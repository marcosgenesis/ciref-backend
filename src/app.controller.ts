import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('refact')
  extractRefacts(@Body() body): Promise<any> {
    return this.appService.extractRefacts(body.name, body.url);
  }

  @Get('info')
  getRefactsInfo(@Query('url') url:string):Promise<any>{
    return this.appService.getRefactsInfo(url);
  }
}
