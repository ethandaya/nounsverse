import {
  Auction,
  Bid,
  GetBidOptions,
  Noun,
  NounService,
} from "./interfaces/noun.service";
import { GraphQLClient } from "graphql-request";
import axios from "axios";
import {
  GET_NOUN_BY_ID,
  GET_AUCTION_BY_ID,
  GET_AUCTIONS_BY_ID,
  GET_BIDS,
} from "@nounsverse/queries";

const NOUNSVERSE_API_URL = process.env.NEXT_PUBLIC_NOUNSVERSE_API_URL;

if (!NOUNSVERSE_API_URL) {
  throw new Error("NEXT_PUBLIC_NOUNSVERSE_API_URL is a required env var");
}

const api = axios.create({
  baseURL: NOUNSVERSE_API_URL,
});

export class SubgraphService implements NounService {
  constructor(
    private readonly address: string,
    private readonly client: GraphQLClient
  ) {}

  public async getNoun(nounId: string): Promise<Noun> {
    const resp = await this.client.request(GET_NOUN_BY_ID, {
      nounId,
    });
    return resp.noun;
  }

  public async getImageURL(nounId: string): Promise<string | undefined> {
    const { data: resp } = await api.get(`/noun/${this.address}/${nounId}`);
    // const resp = await agent.fetchMetadata(this.address, nounId);
    // TODO - it works but ???
    if (resp?.imageURL) {
      const imageURL = resp.imageURL;
      const encodedData = imageURL.slice(26);
      const decodedData = Buffer.from(encodedData, "base64");
      const transparentSvg = decodedData
        .toString("utf8")
        .replace('width="100%" height="100%"', 'width="0%" height="0%"');
      return (
        "data:image/svg+xml;base64," +
        Buffer.from(transparentSvg).toString("base64")
      );
    }
  }

  public async getAuction(nounId: string): Promise<Auction> {
    const resp = await this.client.request(GET_AUCTION_BY_ID, {
      id: nounId,
    });
    return resp.auction;
  }

  public async getAuctions(
    order: "DESC" | "ASC",
    limit: number,
    offset: number
  ): Promise<Auction[]> {
    const resp = await this.client.request(GET_AUCTIONS_BY_ID, {
      order: order.toLowerCase(),
      limit,
      offset,
    });
    return resp.auctions;
  }

  public async getBids(
    { address, blockNumber, offset = 0 }: GetBidOptions,
    bids: Bid[] = []
  ): Promise<Bid[]> {
    const resp = await this.client.request(GET_BIDS, {
      address,
      offset,
      ...(blockNumber && {
        blockNumber:
          typeof blockNumber === "string"
            ? parseInt(blockNumber, 10)
            : blockNumber,
      }),
    });

    bids = [...bids, ...resp.bids];

    // If bids page is max length recurse to get more bids
    // TODO - cache better because shoutout POAP.ETH
    if (resp.bids.length !== 100) {
      return bids;
    } else {
      return this.getBids({ address, blockNumber, offset: offset + 100 }, bids);
    }
  }
}
