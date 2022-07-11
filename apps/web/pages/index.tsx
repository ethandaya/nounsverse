import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import { Auction } from "../services/interfaces/noun.service";
import subgraphService from "../services/subgraph.service";
import { AuctionRow } from "../components/AuctionRow";
import { useInView } from "react-intersection-observer";
import React from "react";
import { Box, Text } from "degen";

const PAGE_SIZE = 3;

const getKey = (
  pageIndex: number,
  previousPageData: Auction[]
): [string, number, number] | null => {
  if (previousPageData && !previousPageData.length) return null;
  return ["DESC", PAGE_SIZE, pageIndex * PAGE_SIZE];
};

// TODO - add get static first page of auctions
const Home: NextPage = () => {
  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    Auction[]
  >(getKey, {
    fetcher: (...args: ["DESC" | "ASC", number, number]) =>
      subgraphService.getAuctions(...args),
  });

  const { ref } = useInView({
    threshold: 0.15,
    delay: 150,
    onChange: (inView: boolean) => inView && !isValidating && setSize(size + 1),
  });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <Box paddingX="4" paddingY="5" backgroundColor="background">
      {data?.map((auctions) =>
        auctions.map((auction) => (
          <AuctionRow key={auction.noun.id} auction={auction} />
        ))
      )}
      {!isRefreshing && !isLoadingInitialData && !isReachingEnd && (
        <Box ref={ref} as="div" display="flex" width="full" height="10" />
      )}
      {!isLoadingInitialData && isLoadingMore && (
        <Text variant="label">Loading...</Text>
      )}
      {isRefreshing && <Text variant="label">Refreshing...</Text>}
    </Box>
  );
};

export default Home;
