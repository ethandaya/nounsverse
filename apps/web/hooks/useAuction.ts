import useSWR, { SWRConfiguration } from "swr";
import subgraphService from "../services/subgraph.service";
import { Auction } from "../services/interfaces/noun.service";

export function useAuction(nounId: string, opts?: SWRConfiguration) {
  const { data, ...rest } = useSWR<Auction>(
    ["getAuction", nounId],
    (_, nounId) => subgraphService.getAuction(nounId),
    opts
  );

  return { auction: data, isLoading: !data, ...rest };
}
