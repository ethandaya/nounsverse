import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { providers } from './common.providers';

@Global()
@Module({
  providers: [PrismaService, ...providers],
  exports: [PrismaService, ...providers],
})
export class CommonModule {}
