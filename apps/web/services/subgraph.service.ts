import {
  Auction,
  Bid,
  GetBidOptions,
  Noun,
  NounService,
} from "./interfaces/noun.service";
import { gql, GraphQLClient } from "graphql-request";
import { Agent } from "@zoralabs/nft-metadata";
import { ALCHEMY_API_KEY } from "../utils/network";
import { NOUN_TOKEN_ADDRESS } from "../utils/address";

const NEXT_PUBLIC_SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

if (!NEXT_PUBLIC_SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_SUBGRAPH_URL is a required env var");
}

const agent = new Agent({
  // Use ethers.js Networkish here: numbers (1/4) or strings (homestead/rinkeby) work here
  network: "homestead",
  // RPC url to access blockchain with. Optional: will fallback to using cloudflare eth
  networkUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  // Timeout: defaults to 40 seconds, recommended timeout is 60 seconds (in milliseconds)
  timeout: 40 * 1000,
});

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_SUBGRAPH_URL);

const ACCOUNT_FRAGMENT = gql`
  fragment AccountFragment on Account {
    address: id
    tokenBalanceRaw
  }
`;

const BID_FRAGMENT = gql`
  fragment BidFragment on Bid {
    id
    amount
    blockNumber
    blockIndex: txIndex
    blockTimestamp
    bidder {
      ...AccountFragment
    }
  }
  ${ACCOUNT_FRAGMENT}
`;

const NOUN_FRAGMENT = gql`
  fragment NounFragment on Noun {
    id
    owner {
      ...AccountFragment
    }
  }
  ${ACCOUNT_FRAGMENT}
`;

const AUCTION_FRAGMENT = gql`
  fragment AuctionFragment on Auction {
    noun {
      ...NounFragment
    }
    amount
    settled
    startTime
    endTime
    bids {
      ...BidFragment
    }
    bidder {
      ...AccountFragment
    }
  }
  ${BID_FRAGMENT}
  ${NOUN_FRAGMENT}
  ${ACCOUNT_FRAGMENT}
`;

const GET_NOUN_BY_ID = gql`
  query GetNounById($nounId: ID!) {
    noun(id: $nounId) {
      ...NounFragment
    }
  }
  ${NOUN_FRAGMENT}
`;

const GET_AUCTION_BY_ID = gql`
  query GetAuctionById($id: ID!) {
    auction(id: $id) {
      ...AuctionFragment
    }
  }
  ${AUCTION_FRAGMENT}
`;

const GET_AUCTIONS_BY_ID = gql`
  query GetAuctions($order: String, $limit: Int, $offset: Int) {
    auctions(
      orderBy: endTime
      orderDirection: $order
      first: $limit
      skip: $offset
    ) {
      ...AuctionFragment
    }
  }
  ${AUCTION_FRAGMENT}
`;

const GET_BIDS = gql`
  query GetBids($address: String, $blockNumber: Int, $offset: Int!) {
    bids(
      where: { bidder: $address }
      block: { number: $blockNumber }
      skip: $offset
    ) {
      ...BidFragment
    }
  }
  ${BID_FRAGMENT}
`;

class SubgraphAndOnChainService implements NounService {
  constructor(private readonly client: GraphQLClient) {}

  public async getNoun(nounId: string): Promise<Noun> {
    const resp = await this.client.request(GET_NOUN_BY_ID, {
      nounId,
    });
    return resp.noun;
  }

  public async getImageURL(nounId: string): Promise<string | undefined> {
    const resp = await agent.fetchMetadata(NOUN_TOKEN_ADDRESS, nounId);
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

  public async getBids({
    address,
    blockNumber,
    offset = 0,
  }: GetBidOptions): Promise<Bid[]> {
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

    const bids = resp.bids;

    // If bids page is max length recurse to get more bids
    // TODO - cache better because shoutout POAP.ETH
    if (bids.length >= 100) {
      const nextBids = await this.getBids({
        address,
        blockNumber,
        offset: bids.length,
      });
      bids.push(...nextBids);
    }

    return bids;
  }
}

// TODO - lilnouns service
export default new SubgraphAndOnChainService(SubgraphClient);
