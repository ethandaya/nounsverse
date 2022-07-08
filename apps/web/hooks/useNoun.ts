import useSWR, { SWRConfiguration } from "swr";
import subgraphService from "../services/subgraph.service";

export function useNoun(nounId: string, opts?: SWRConfiguration) {
  const { data, ...rest } = useSWR(
    ["getNoun", nounId],
    (_, nounId) => subgraphService.getNoun(nounId),
    opts
  );

  return { noun: data, isLoading: !data, ...rest };
}
