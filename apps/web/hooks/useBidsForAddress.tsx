import useSWR, { SWRConfiguration } from "swr";
import subgraphService from "../services/subgraph.service";

export function useBidsForAddress(address: string, opts?: SWRConfiguration) {
  const { data, ...rest } = useSWR(
    ["getBidsForAddress", address],
    (_, address) => subgraphService.getBids({ address }),
    opts
  );

  return { bids: data, isLoading: !data, ...rest };
}
