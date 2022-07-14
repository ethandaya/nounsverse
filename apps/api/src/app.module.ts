import { Module } from '@nestjs/common';
import { NounModule } from './noun/noun.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    NounModule,
  ],
})
export class AppModule {}
