import { Auction, Bid, GetBidOptions, Noun, NounService } from "./noun.service";
import { gql, GraphQLClient } from "graphql-request";

const NEXT_PUBLIC_SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

if (!NEXT_PUBLIC_SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_SUBGRAPH_URL is a required env var");
}

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
  }
  ${BID_FRAGMENT}
  ${NOUN_FRAGMENT}
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
  query GetBids($address: String) {
    bids(where: { bidder: $address }) {
      ...BidFragment
    }
  }
  ${BID_FRAGMENT}
`;

class SubgraphService implements NounService {
  constructor(private readonly client: GraphQLClient) {}

  public async getNoun(nounId: string): Promise<Noun> {
    const resp = await this.client.request(GET_NOUN_BY_ID, {
      nounId,
    });
    return resp.noun;
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

  public async getBids({ address }: GetBidOptions): Promise<Bid[]> {
    const resp = await this.client.request(GET_BIDS, {
      address,
    });
    return resp.bids;
  }
}

// TODO - lilnouns service
export default new SubgraphService(SubgraphClient);
