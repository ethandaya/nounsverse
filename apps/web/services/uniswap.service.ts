import { ExchangeService } from "./interfaces/exchange.service";
import { gql, GraphQLClient } from "graphql-request";

const NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL;

if (!NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL is a required env var");
}

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL);

const GET_ETH_BUNDLE = gql`
  query GetEthBundle($blockNumber: Int!) {
    bundles(first: 1, block: { number: $blockNumber }) {
      id
      ethPriceUSD
    }
  }
`;

export class UniswapService implements ExchangeService {
  constructor(private readonly client: GraphQLClient) {}

  public async getETHPrice(blockNumber?: number | string): Promise<string> {
    const resp = await this.client.request(GET_ETH_BUNDLE, {
      ...(blockNumber && {
        blockNumber:
          typeof blockNumber === "string"
            ? parseInt(blockNumber, 10)
            : blockNumber,
      }),
    });
    return resp.bundles[0].ethPriceUSD;
  }
}

export default new UniswapService(SubgraphClient);
