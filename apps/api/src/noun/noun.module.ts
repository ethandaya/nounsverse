import { Module } from '@nestjs/common';
import { NounService } from './noun.service';
import { NounController } from './noun.controller';

@Module({
  providers: [NounService],
  controllers: [NounController],
})
export class NounModule {}
