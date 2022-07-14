import { createContext, useCallback, useMemo, useState } from "react";
import { LIL_NOUN_TOKEN_ADDRESS, NOUN_TOKEN_ADDRESS } from "../utils/address";
import { NounService } from "./interfaces/noun.service";
import { SubgraphService } from "./subgraph.service";
import { GraphQLClient } from "graphql-request";

type ServiceProviderProps = {
  address: string;
  config: NounishConfig;
  children: JSX.Element;
};

const NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL;

if (!NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL) {
  throw new Error("NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL is a required env var");
}

const NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL;

if (!NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL) {
  throw new Error(
    "NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL is a required env var"
  );
}

export type NounishConfig = {
  baseURI: string;
  externalBaseURI: string;
  name: string;
};

export interface ServiceCtx {
  address: string;
  service: NounService;
  config: NounishConfig;
}

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL);

export const configLookup = (address: string): NounishConfig | undefined => {
  switch (address) {
    case NOUN_TOKEN_ADDRESS:
      return {
        baseURI: NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL,
        externalBaseURI: "https://nouns.wtf/noun",
        name: "Noun",
      };
    case LIL_NOUN_TOKEN_ADDRESS:
      return {
        baseURI: NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL,
        externalBaseURI: "https://lilnouns.wtf/lilnoun",
        name: "Lil Noun",
      };
    default:
      return;
  }
};

export const defaultNounService = new SubgraphService(
  NOUN_TOKEN_ADDRESS,
  SubgraphClient
);

export const defaultNounConfig = configLookup(
  NOUN_TOKEN_ADDRESS
) as NounishConfig;

export const ServiceContext = createContext<ServiceCtx>({
  address: NOUN_TOKEN_ADDRESS,
  service: defaultNounService,
  config: defaultNounConfig,
});

export function ServiceCtxProvider({
  children,
  config,
  address,
}: ServiceProviderProps) {
  const service = useMemo(
    () => new SubgraphService(address, new GraphQLClient(config.baseURI)),
    [address, config.baseURI]
  );

  // TODO - setup config lookup with record set
  // const [config, setConfig] = useState<NounishConfig>(defaultNounConfig);
  //
  // const handleSetAddress = useCallback((address: string) => {
  //   setAddress(address);
  //   const config = configLookup(address);
  //   if (!config) {
  //     // TODO - handle this not terribly
  //     throw new Error("Invalid Address");
  //   }
  //   const client = new GraphQLClient(config.baseURI);
  //   setService(new SubgraphService(address, client));
  //   setConfig(config);
  // }, []);

  return (
    <ServiceContext.Provider
      value={{
        address,
        service,
        config,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
