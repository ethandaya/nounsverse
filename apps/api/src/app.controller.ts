import { Controller, Get } from '@nestjs/common';

@Controller('noun')
export class AppController {
  @Get('/health')
  public async getMetadata() {
    return 'ok';
  }
}
