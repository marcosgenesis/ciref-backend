import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AppService {
  constructor(private api: HttpService) {}
  async extractRefacts(name: string, url: string):Promise<any> {
    try {
      const response = await this.api.axiosRef.post('http://localhost:8080/refact',{name,url});
      return response.data.map(item=>(JSON.parse(item)))
    } catch (error) {
      console.log(error);
    }
  }

  async getRefactsInfo(url: string):Promise<any> {
    try {
      const data = await this.extractRefacts(url,url)
      const a = data.reduce((acc,i) => {
        if (acc[i?.type]) {
          acc[i?.type] += 1;
          return acc;
        }
        acc[i?.type] = 1;
        return acc;
      },{})
      return a
    } catch (error) {
      console.log(error);
    }
  }
}
