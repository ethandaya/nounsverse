import { GetStaticPaths, GetStaticProps } from "next";
import { NOUN_TOKEN_ADDRESS } from "../utils/address";
import { configLookup, NounishConfig } from "./ServiceContext";
import { GraphQLClient } from "graphql-request";
import { SubgraphService } from "./subgraph.service";
import { Auction } from "./interfaces/noun.service";
import { PAGE_SIZE } from "../utils/pagination";

export type StaticParams = {
  address: string;
};

export type StaticProps = {
  nounAddress: string;
  config: NounishConfig;
  initialPage: Auction[];
};

export const getStaticAuctionProps: GetStaticProps<
  StaticProps,
  StaticParams
> = async ({ params = {} }) => {
  const address = params.address || NOUN_TOKEN_ADDRESS;
  const config = configLookup(address);
  if (!config) {
    // TODO - derive config from user entry for new contracts
    throw new Error("No Matching Config for address");
  }

  const client = new GraphQLClient(config.baseURI);
  const service = new SubgraphService(address, client);
  const auctions: Auction[] = await service.getAuctions("DESC", PAGE_SIZE, 0);

  return {
    props: { nounAddress: address, config, initialPage: auctions },
    revalidate: 30,
  };
};

export const getFallbackStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};
