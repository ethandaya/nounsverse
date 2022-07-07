import { Auction, NounService } from "./noun.service";
import { gql, GraphQLClient } from "graphql-request";

const NEXT_PUBLIC_SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

if (!NEXT_PUBLIC_SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_SUBGRAPH_URL is a required env var");
}

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_SUBGRAPH_URL);

const GET_AUCTION_BY_ID = gql`
  query GetAuctionById($id: String) {
    auction(id: $id) {
      noun {
        id
      }
    }
  }
`;

class SubgraphService implements NounService {
  constructor(private readonly client: GraphQLClient) {}

  public async getAuction(nounId: string): Promise<Auction> {
    const resp = await this.client.request(GET_AUCTION_BY_ID, {
      id: nounId,
    });
    return resp.auction;
  }
}

export default new SubgraphService(SubgraphClient);
