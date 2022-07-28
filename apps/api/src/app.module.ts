import { Module } from '@nestjs/common';
import { NounModule } from './noun/noun.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';

const envFilePath = process.env.STAGE
  ? `.env.${process.env.STAGE}`
  : '.env.local';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    CommonModule,
    NounModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
