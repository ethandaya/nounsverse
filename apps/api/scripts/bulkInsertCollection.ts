import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';
import { promises as fs } from 'fs';
import { Client } from 'typesense';
import { nounToTypesenseDocument } from '../src/noun/noun.utils';
import { ConfigService } from '@nestjs/config';

// TODO - CLI params
const CONTRACT_ADDRESS = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';

async function main() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prisma = app.get(PrismaService);
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
  const data = await fs.readFile(
    `./fixtures/nouns-${CONTRACT_ADDRESS}.json`,
    'utf8',
  );
  const nouns = JSON.parse(data);
  await prisma.noun.createMany({
    data: nouns,
    skipDuplicates: true,
  });
  await client
    .collections('nouns')
    .documents()
    .import(nouns.map(nounToTypesenseDocument));
}

main().then(() => console.log('Nouns Collection Created'));
