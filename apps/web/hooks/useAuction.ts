import useSWR, { SWRConfiguration } from "swr";
import subgraphService from "../services/subgraph.service";

export function useAuction(nounId: string, opts: SWRConfiguration) {
  const { data, ...rest } = useSWR(
    ["getAuction", nounId],
    (_, nounId) => subgraphService.getAuction(nounId),
    opts
  );

  return { auction: data, isLoading: !data, ...rest };
}
