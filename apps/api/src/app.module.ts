import { Module } from '@nestjs/common';
import { NounModule } from './noun/noun.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    NounModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
