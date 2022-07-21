import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NounService } from '../src/noun/noun.service';
import * as fs from 'fs';

// TODO - CLI params
const CONTRACT_ADDRESS = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';
const TOTAL_SUPPLY = 382;
const START_FROM = 1;

async function promiseAllInBatches(task, items, batchSize) {
  let position = 0;
  let results = [];
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize);
    results = [
      ...results,
      ...(await Promise.all(itemsForBatch.map((item) => task(item)))),
    ];
    position += batchSize;
  }
  return results;
}

async function main() {
  const app = await NestFactory.create(AppModule);
  const nounService = app.get(NounService);

  const ids = [...Array(TOTAL_SUPPLY).keys()].slice(
    START_FROM - 1,
    TOTAL_SUPPLY,
  );

  const nouns = await promiseAllInBatches(
    (id: string) =>
      nounService.fetchOrGet(CONTRACT_ADDRESS, id.toString(), false),
    ids,
    4,
  );

  fs.writeFileSync(
    `./fixtures/nouns-${CONTRACT_ADDRESS}.json`,
    JSON.stringify(nouns),
  );
}

main().then(() => console.log('Nouns Dump Created'));
