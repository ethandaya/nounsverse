import useSWR from "swr";
import subgraphService from "../services/subgraph.service";

export function useActiveAuction() {
  const { data, ...rest } = useSWR(["getActiveAuction"], () =>
    subgraphService.getAuctions("DESC", 1, 0).then((res) => res[0])
  );

  return { auction: data, isLoading: !data, ...rest };
}
