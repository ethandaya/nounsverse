import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import { Auction } from "../services/interfaces/noun.service";
import { AuctionRow } from "../components/AuctionRow";
import { useInView } from "react-intersection-observer";
import React, { useCallback, useContext } from "react";
import { Box, Button } from "degen";
import { useNounService } from "../hooks/useNounService";
import { ServiceContext } from "../services/ServiceContext";
import {
  isAddressMatch,
  LIL_NOUN_TOKEN_ADDRESS,
  NOUN_TOKEN_ADDRESS,
} from "../utils/address";
import { Header } from "../components/Header";
import { Text } from "../elements/Text";

const PAGE_SIZE = 3;

// TODO - add get static first page of auctions
const Home: NextPage = () => {
  const service = useNounService();
  const { address, setAddress } = useContext(ServiceContext);

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
    refreshInterval: 5000,
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
    <Box>
      <Header />
      <Box paddingX="4" paddingBottom="5">
        <Box display="flex" flexDirection="row">
          <Text
            weight="bold"
            variant="medium"
            color={
              isAddressMatch(address, NOUN_TOKEN_ADDRESS)
                ? "yellow"
                : "textSecondary"
            }
            onClick={() => setAddress(NOUN_TOKEN_ADDRESS)}
            marginRight="2.5"
          >
            NOUNS
          </Text>
          <Text
            weight="bold"
            variant="medium"
            color={
              isAddressMatch(address, LIL_NOUN_TOKEN_ADDRESS)
                ? "yellow"
                : "textSecondary"
            }
            onClick={() => setAddress(LIL_NOUN_TOKEN_ADDRESS)}
          >
            LIL NOUNS
          </Text>
        </Box>
        {data?.map((auctions) =>
          auctions.map((auction) => (
            <AuctionRow
              key={`${address}-${auction.noun.id}`}
              auction={auction}
            />
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
    </Box>
  );
};

export default Home;
