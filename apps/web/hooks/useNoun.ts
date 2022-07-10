import useSWR, { SWRConfiguration } from "swr";
import subgraphService from "../services/subgraph.service";

export function useNoun(nounId: string, opts?: SWRConfiguration) {
  const { data, ...rest } = useSWR(
    ["getNoun", nounId],
    (_, nounId) => subgraphService.getNoun(nounId),
    opts
  );
  const { data: imageURL } = useSWR(["getNounImageURL", nounId], (_, nounId) =>
    subgraphService.getImageURL(nounId)
  );

  return { noun: data, imageURL, isLoading: !data, ...rest };
}
