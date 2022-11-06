import { Body, Controller, Post } from '@nestjs/common';
import { WeightsService } from './weights.service';

@Controller('weights')
export class WeightsController {
  constructor(private readonly weightsService: WeightsService) {}

  @Post()
  newWeights(@Body() body): Promise<any> {
    return this.weightsService.newRepoWeights(body.repoUrl, body.weights);
  }
}
