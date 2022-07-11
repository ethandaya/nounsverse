import useSWR, { SWRConfiguration } from "swr";
import { useNounService } from "./useNounService";

export function useNoun(nounId: string, opts?: SWRConfiguration) {
  const service = useNounService();
  const { data, ...rest } = useSWR(
    ["getNoun", nounId],
    (_, nounId) => service.getNoun(nounId),
    opts
  );
  const { data: imageURL } = useSWR(["getNounImageURL", nounId], (_, nounId) =>
    service.getImageURL(nounId)
  );

  return { noun: data, imageURL, isLoading: !data, ...rest };
}
