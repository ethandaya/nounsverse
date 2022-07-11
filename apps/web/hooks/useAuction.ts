import useSWR, { SWRConfiguration } from "swr";
import { Auction } from "../services/interfaces/noun.service";
import { useNounService } from "./useNounService";

export function useAuction(nounId: string, opts?: SWRConfiguration) {
  const service = useNounService();
  const { data, ...rest } = useSWR<Auction>(
    ["getAuction", nounId],
    (_, nounId) => service.getAuction(nounId),
    opts
  );

  return { auction: data, isLoading: !data, ...rest };
}
