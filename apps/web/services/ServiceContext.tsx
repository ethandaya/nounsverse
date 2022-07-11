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

export interface ServiceCtx {
  address: string;
  setAddress: (address: string) => void;
  service: NounService;
}

const SubgraphClient = new GraphQLClient(NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL);

function baseURLLookup(address: string) {
  switch (address) {
    case NOUN_TOKEN_ADDRESS:
      return NEXT_PUBLIC_NOUNS_DAO_SUBGRAPH_URL;
    case LIL_NOUN_TOKEN_ADDRESS:
      return NEXT_PUBLIC_LIL_NOUNS_DAO_SUBGRAPH_URL;
    default:
      return;
  }
}

const defaultNounService = new SubgraphService(
  NOUN_TOKEN_ADDRESS,
  SubgraphClient
);

export const ServiceContext = createContext<ServiceCtx>({
  address: NOUN_TOKEN_ADDRESS,
  service: defaultNounService,
  setAddress: (address: string) => {
    return;
  },
});

export function ServiceCtxProvider({ children }: ServiceProviderProps) {
  const [address, setAddress] = useState(NOUN_TOKEN_ADDRESS);
  const [service, setService] = useState<NounService>(defaultNounService);

  const handleSetAddress = useCallback((address: string) => {
    setAddress(address);
    const baseURI = baseURLLookup(address);
    if (!baseURI) {
      // TODO - handle this not terribly
      throw new Error("Invalid Address");
    }
    const client = new GraphQLClient(baseURI);
    setService(new SubgraphService(address, client));
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        address,
        setAddress: handleSetAddress,
        service,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
