import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
