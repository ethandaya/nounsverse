import useSWR, { SWRConfiguration } from "swr";
import subgraphService from "../services/subgraph.service";
import { GetBidOptions } from "../services/noun.service";

export function useBidsForAddress(
  options: GetBidOptions,
  opts?: SWRConfiguration
) {
  const { data, ...rest } = useSWR(
    ["getBidsForAddress", options],
    (_, options) => subgraphService.getBids(options),
    opts
  );

  return { bids: data, isLoading: !data, ...rest };
}
