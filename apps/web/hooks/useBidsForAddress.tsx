import useSWR, { SWRConfiguration } from "swr";
import { GetBidOptions } from "../services/interfaces/noun.service";
import { useNounService } from "./useNounService";

export function useBidsForAddress(
  options: GetBidOptions,
  opts?: SWRConfiguration
) {
  const service = useNounService();
  const { data, ...rest } = useSWR(
    ["getBidsForAddress", options],
    (_, options) => service.getBids(options),
    opts
  );

  return { bids: data, isLoading: !data, ...rest };
}
