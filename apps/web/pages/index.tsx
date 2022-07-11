import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import { Auction } from "../services/interfaces/noun.service";
import { AuctionRow } from "../components/AuctionRow";
import { useInView } from "react-intersection-observer";
import React, { useCallback } from "react";
import { Box } from "degen";
import { useNounService } from "../hooks/useNounService";
import { Text } from "../elements/Text";
import { useServiceContext } from "../hooks/useServiceContext";
import { ContractSwitcher } from "../compositions/ContractSwitcher";
import { Banner } from "../components/Banner";

const PAGE_SIZE = 3;

// TODO - add get static first page of auctions
const Home: NextPage = () => {
  const service = useNounService();
  const { address } = useServiceContext();

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
  });

  const { ref } = useInView({
    threshold: 0.15,
    delay: 100,
    onChange: (inView: boolean) => inView && !isValidating && setSize(size + 1),
  });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data?.length === size;

  return (
    <Box paddingX="3" paddingY="6">
      <ContractSwitcher isWorking={isLoadingInitialData || isRefreshing} />
      {data?.map((auctions) =>
        auctions.map((auction) => (
          <AuctionRow key={`${address}-${auction.noun.id}`} auction={auction} />
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
};

export default Home;
