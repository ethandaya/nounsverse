import useSWR from "swr";
import subgraphService from "../services/subgraph.service";

export function useAuction(nounId: string) {
  const { data, ...rest } = useSWR(["getAuction", nounId], (_, nounId) =>
    subgraphService.getAuction(nounId)
  );

  return { auction: data, isLoading: !data, ...rest };
}
