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

  if (nounId === "380") {
    console.log({ data });
  }

  return { auction: data, isLoading: typeof data === "undefined", ...rest };
}
