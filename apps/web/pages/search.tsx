import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  Configure,
  CurrentRefinements,
  InfiniteHits,
  InstantSearch,
  RefinementList,
  SearchBox,
  ToggleRefinement,
} from "react-instantsearch-hooks-web";
import { Box } from "degen";
import { Noun } from "../services/interfaces/noun.service";
import { AuctionRow } from "../components/AuctionRow";
import { LIL_NOUN_TOKEN_ADDRESS, NOUN_TOKEN_ADDRESS } from "../utils/address";

const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xyz",
    nodes: [
      {
        host: "localhost",
        port: 8108,
        protocol: "http",
      },
    ],
  },
  additionalSearchParameters: {
    query_by:
      "name,tokenAddress,description,attribute_background,attribute_glasses,attribute_body,attribute_accessory,attribute_head",
  },
});
const searchClient = typesenseInstantSearchAdapter.searchClient;

function Hit({ hit }: { hit: Noun }) {
  return <AuctionRow nounId={hit.tokenId.toString()} />;
}

const App = () => {
  return (
    <InstantSearch indexName="nouns" searchClient={searchClient}>
      <SearchBox />
      <Box display="flex">
        <RefinementList attribute="attribute_background" />
        <RefinementList attribute="attribute_glasses" />
        <RefinementList attribute="attribute_body" />
        <RefinementList attribute="attribute_accessory" />
        <RefinementList attribute="attribute_head" />
      </Box>
      <CurrentRefinements />
      <Configure
        hitsPerPage={10}
        filters={`tokenAddress:${NOUN_TOKEN_ADDRESS}`}
      />
      <InfiniteHits hitComponent={Hit} />
    </InstantSearch>
  );
};

export default App;
