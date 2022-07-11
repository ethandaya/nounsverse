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
import Head from "next/head";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../utils/seo";

const PAGE_SIZE = 3;

// TODO - add get static first page of auctions
// TODO - route the address for each dao — maybe next multitenant config
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
      <Head>
        <title>{SITE_TITLE}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_TITLE} key="title" />
        <meta
          name="og:description"
          property="og:description"
          content={SITE_DESCRIPTION}
        />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:site" content={SITE_URL} />
        <meta name="twitter:creator" content="@ethandaya" />

        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />

        <meta property="og:image" content={`${SITE_URL}/ogImage.jpg`} />
        <meta name="twitter:image" content={`${SITE_URL}/ogImage.jpg`} />
      </Head>
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
