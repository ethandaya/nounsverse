import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { Client } from 'typesense';
import { nounSchema } from '../src/noun/noun.utils';

async function main() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const client = new Client({
    nodes: [
      {
        host: configService.get('TYPESENSE_HOST'),
        port: configService.get('TYPESENSE_PORT'),
        protocol: configService.get('TYPESENSE_PROTOCOL'),
      },
    ],
    apiKey: configService.get('TYPESENSE_API_KEY'),
    connectionTimeoutSeconds: 10,
  });
  await client.collections('nouns').delete();
  await client.collections().create(nounSchema);
}

main().then(() => console.log('Nouns Collection Created'));
