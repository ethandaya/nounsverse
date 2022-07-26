import { useNounService } from "../hooks/useNounService";
import { useServiceContext } from "../hooks/useServiceContext";
import React, { useCallback, useMemo } from "react";
import { Auction } from "../services/interfaces/noun.service";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import { ContractSwitcher } from "../compositions/ContractSwitcher";
import { AuctionRow } from "../components/AuctionRow";
import { Box } from "degen";
import { Text } from "../elements/Text";
import { Banner } from "../components/Banner";
import { PAGE_SIZE } from "../utils/pagination";

type ViewAuctionsTemplateProps = {
  initialPage?: Auction[];
};

export function ViewAuctionsTemplate({
  initialPage = [],
}: ViewAuctionsTemplateProps) {
  const service = useNounService();
  const { address, config } = useServiceContext();

  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: Auction[]
    ): [string, string, number, number] | null => {
      if (previousPageData && !previousPageData.length) return null;
      return [address, "DESC", PAGE_SIZE, pageIndex * PAGE_SIZE];
    },
    [address]
  );

  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    Auction[]
  >(getKey, {
    fetcher: (_, ...args: ["DESC" | "ASC", number, number]) =>
      service.getAuctions(...args),
    refreshInterval: 1000 * 60,
    fallbackData: [initialPage],
    initialSize: initialPage.length,
  });

  const { ref } = useInView({
    threshold: 0.15,
    delay: 100,
    onChange: (inView: boolean) => inView && !isValidating && setSize(size + 1),
  });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore = useMemo(
    () =>
      isLoadingInitialData ||
      (size > 0 && data && typeof data[size - 1] === "undefined"),
    [data, isLoadingInitialData, size]
  );
  const isEmpty = useMemo(() => data?.[0]?.length === 0, [data]);
  const isReachingEnd = useMemo(
    () => isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE),
    [data, isEmpty]
  );
  const isRefreshing = useMemo(
    () => isValidating && data?.length === size,
    [data?.length, isValidating, size]
  );

  return (
    <Box paddingX="3" paddingY="6">
      <ContractSwitcher isWorking={isLoadingInitialData || isRefreshing} />
      {data?.map((auctions) =>
        auctions.map((auction) => (
          <AuctionRow
            nounId={auction.noun.id}
            key={`${address}-${auction.noun.id}`}
            auction={auction}
          />
        ))
      )}
      {!isRefreshing && !isLoadingInitialData && !isReachingEnd && (
        <Box ref={ref} as="div" display="flex" width="full" height="10" />
      )}
      {!isLoadingInitialData && isLoadingMore && (
        <Box position="fixed" bottom="6" left="0" right="0">
          <Text variant="label" paddingX="3">
            Loading...
          </Text>
        </Box>
      )}
      <Banner />
    </Box>
  );
}
