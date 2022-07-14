import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlchemyProvider } from '@ethersproject/providers';
import { Agent } from '@zoralabs/nft-metadata';

export const RPC_PROVIDER = 'RPC_PROVIDER';
export const METADATA_AGENT = 'METADATA_AGENT';

export const providers: Provider[] = [
  {
    provide: RPC_PROVIDER,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new AlchemyProvider(
        parseInt(configService.get('NETWORK_ID'), 10),
        configService.get('ALCHEMY_API_KEY'),
      ),
  },
  {
    provide: METADATA_AGENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new Agent({
        network: 'homestead',
        networkUrl: `https://eth-mainnet.g.alchemy.com/v2/${configService.get(
          'ALCHEMY_API_KEY',
        )}`,
        timeout: 40 * 1000,
      }),
  },
];
