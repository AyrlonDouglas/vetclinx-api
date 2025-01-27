import { ApiPresenter } from '@common/infra/Api.presenter';
import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('health')
  health() {
    return new ApiPresenter({
      result: { healthy: true },
      message: 'A Api está saudável.',
    });
  }
}
