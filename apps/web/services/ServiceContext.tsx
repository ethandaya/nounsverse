import { createContext, useCallback, useState } from "react";
import { LIL_NOUN_TOKEN_ADDRESS, NOUN_TOKEN_ADDRESS } from "../utils/address";
import { NounService } from "./interfaces/noun.service";
import { SubgraphService } from "./subgraph.service";
import { GraphQLClient } from "graphql-request";

type ServiceProviderProps = {
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

type NounishConfig = {
  baseURI: string;
  externalBaseURI: string;
};

export interface ServiceCtx {
  address: string;
  setAddress: (address: string) => void;
  service: NounService;
  config: NounishConfig;
}

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL);

const configLookup = (address: string): NounishConfig | undefined => {
  switch (address) {
    case NOUN_TOKEN_ADDRESS:
      return {
        baseURI: NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL,
        externalBaseURI: "https://nouns.wtf/noun",
      };
    case LIL_NOUN_TOKEN_ADDRESS:
      return {
        baseURI: NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL,
        externalBaseURI: "https://lilnouns.wtf/lilnoun",
      };
    default:
      return;
  }
};

const defaultNounService = new SubgraphService(
  NOUN_TOKEN_ADDRESS,
  SubgraphClient
);

const defaultNounConfig = configLookup(NOUN_TOKEN_ADDRESS) as NounishConfig;

export const ServiceContext = createContext<ServiceCtx>({
  address: NOUN_TOKEN_ADDRESS,
  service: defaultNounService,
  setAddress: (address: string) => {
    return;
  },
  config: defaultNounConfig,
});

export function ServiceCtxProvider({ children }: ServiceProviderProps) {
  const [address, setAddress] = useState(NOUN_TOKEN_ADDRESS);
  const [service, setService] = useState<NounService>(defaultNounService);
  // TODO - setup config lookup with record set
  const [config, setConfig] = useState<NounishConfig>(defaultNounConfig);

  const handleSetAddress = useCallback((address: string) => {
    setAddress(address);
    const config = configLookup(address);
    if (!config) {
      // TODO - handle this not terribly
      throw new Error("Invalid Address");
    }
    const client = new GraphQLClient(config.baseURI);
    setService(new SubgraphService(address, client));
    setConfig(config);
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        address,
        setAddress: handleSetAddress,
        service,
        config,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
