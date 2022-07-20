import { Inject, Injectable } from '@nestjs/common';
import { METADATA_AGENT } from '../common/common.providers';
import { Agent } from '@zoralabs/nft-metadata';
import { CreateNounDto } from './dto/create-noun.dto';
import { PrismaService } from '../common/prisma.service';
import { Client } from 'typesense';
import { ConfigService } from '@nestjs/config';
import { flattenAttributesForSearch } from './noun.utils';

@Injectable()
export class NounService {
  typesense: Client;

  constructor(
    private readonly configService: ConfigService,
    @Inject(METADATA_AGENT) private readonly agent: Agent,
    private readonly prisma: PrismaService,
  ) {
    this.typesense = new Client({
      nodes: [
        {
          host: configService.get('TYPESENSE_HOST'),
          port: configService.get('TYPESENSE_PORT'),
          protocol: configService.get('TYPESENSE_PROTOCOL'),
        },
      ],
      apiKey: configService.get('TYPESENSE_API_KEY'),
      connectionTimeoutSeconds: 2,
    });
  }

  public async fetchOrGet(tokenAddress: string, tokenId: string) {
    const noun = await this.findOne(tokenAddress, tokenId);
    if (noun) {
      return noun;
    }
    const resp = await this.fetchMetadata(tokenAddress, tokenId);
    const result = await this.saveNoun({
      tokenId: resp.tokenId,
      tokenAddress: resp.tokenAddress,
      metadata: resp.metadata,
      tokenURI: resp.tokenURI,
      tokenURL: resp.tokenURL,
      tokenURLMimeType: resp.tokenURLMimeType,
      name: resp.name || null,
      description: resp.description || null,
      contentURL: resp.contentURL || null,
      contentURLMimeType: resp.contentURLMimeType || null,
      imageURL: resp.imageURL || null,
      imageURLMimeType: resp.imageURLMimeType || null,
      externalLink: resp.externalLink || null,
      attributes: resp.attributes || [],
    });
    await this.typesense
      .collections('nouns')
      .documents()
      .create(
        {
          id: `${tokenAddress}=${tokenId}`,
          ...result,
          ...flattenAttributesForSearch(result.attributes),
        },
        {
          dirty_values: 'coerce_or_reject',
        },
      );
    return result;
  }

  private async findOne(tokenAddress: string, tokenId: string) {
    return this.prisma.noun.findUnique({
      where: {
        tokenId_tokenAddress: {
          tokenId,
          tokenAddress,
        },
      },
    });
  }

  private async fetchMetadata(tokenAddress: string, tokenId: string) {
    return this.agent.fetchMetadata(tokenAddress, tokenId);
  }

  private async saveNoun(dto: CreateNounDto) {
    return this.prisma.noun.create({ data: dto });
  }
}
