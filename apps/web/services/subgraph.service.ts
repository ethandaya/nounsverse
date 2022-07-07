import { Auction, NounService } from "./noun.service";
import { gql, GraphQLClient } from "graphql-request";

const NEXT_PUBLIC_SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

if (!NEXT_PUBLIC_SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_SUBGRAPH_URL is a required env var");
}

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_SUBGRAPH_URL);

const AUCTION_FRAGMENT = gql`
  fragment AuctionFragment on Auction {
    noun {
      id
    }
    bids {
      id
    }
  }
`;

const GET_AUCTION_BY_ID = gql`
  query GetAuctionById($id: String) {
    auction(id: $id) {
      ...AuctionFragment
    }
  }
  ${AUCTION_FRAGMENT}
`;

const GET_AUCTIONS_BY_ID = gql`
  query GetAuctionsById($order: String, $limit: Int, $offset: Int) {
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

class SubgraphService implements NounService {
  constructor(private readonly client: GraphQLClient) {}

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
}

export default new SubgraphService(SubgraphClient);
