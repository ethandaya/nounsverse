import { Inject, Injectable } from '@nestjs/common';
import { METADATA_AGENT } from '../common/common.providers';
import { Agent } from '@zoralabs/nft-metadata';
import { CreateNounDto } from './dto/create-noun.dto';
import { PrismaService } from '../common/prisma.service';
import { Client } from 'typesense';
import { ConfigService } from '@nestjs/config';
import { nounToTypesenseDocument } from './noun.utils';
import request from 'graphql-request';
import { GET_AUCTION_BY_ID } from '@nounsverse/queries';

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

  public async fetchOrGet(tokenAddress: string, tokenId: string, sync = true) {
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
    if (sync) {
      await this.typesense
        .collections('nouns')
        .documents()
        .create(nounToTypesenseDocument(result), {
          dirty_values: 'coerce_or_reject',
        });
    }

    return result;
  }

  private lookupSubgraphBase(tokenAddress: string): string | undefined {
    switch (tokenAddress) {
      case this.configService.get('NOUNS_ADDRESS'):
        return this.configService.get('NOUNS_DAO_SUBGRAPH_URL');
      case this.configService.get('LIL_NOUNS_ADDRESS'):
        return this.configService.get('LIL_NOUNS_DAO_SUBGRAPH_URL');
      default:
        return;
    }
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

  public async fetchAuction(tokenAddress: string, tokenId: string) {
    const BASE_URL = this.lookupSubgraphBase(tokenAddress);
    if (!BASE_URL) {
      throw new Error(`No configured subgraph for ${tokenAddress}`);
    }
    const resp = await request(BASE_URL, GET_AUCTION_BY_ID, {
      id: tokenId,
    });
    return resp.auction;
  }

  private async saveNoun(dto: CreateNounDto) {
    return this.prisma.noun.create({ data: dto });
  }
}
