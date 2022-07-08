import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import { Auction } from "../services/noun.service";
import subgraphService from "../services/subgraph.service";
import { BidTable } from "../components/BidTable";
import { AuctionRow } from "../components/AuctionRow";

const PAGE_SIZE = 3;

const getKey = (
  pageIndex: number,
  previousPageData: Auction[]
): [string, number, number] | null => {
  if (previousPageData && !previousPageData.length) return null;
  return ["DESC", PAGE_SIZE, pageIndex * PAGE_SIZE];
};

const Home: NextPage = () => {
  const {
    data = [],
    size,
    setSize,
  } = useSWRInfinite<Auction[]>(getKey, {
    fetcher: (...args: ["DESC" | "ASC", number, number]) =>
      subgraphService.getAuctions(...args),
  });

  return (
    <div>
      {/*<Header />*/}
      {data.map((auctions) =>
        auctions.map((auction) => (
          <AuctionRow key={auction.noun.id} auction={auction} />
        ))
      )}
      <button onClick={() => setSize(size + 1)}>NEXT PAGE</button>
    </div>
  );
};

export default Home;
