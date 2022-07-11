import useSWR from "swr";
import { useNounService } from "./useNounService";

export function useActiveAuction() {
  const service = useNounService();
  const { data, ...rest } = useSWR(["getActiveAuction"], () =>
    service.getAuctions("DESC", 1, 0).then((res) => res[0])
  );

  return { auction: data, isLoading: !data, ...rest };
}
