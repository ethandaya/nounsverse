import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import { Auction } from "../services/noun.service";
import subgraphService from "../services/subgraph.service";
import { BidRow } from "../components/BidRow";
import { Header } from "../components/Header";
import { BidTable } from "../components/BidTable";

const PAGE_SIZE = 5;

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
    error,
    size,
    setSize,
  } = useSWRInfinite<Auction[]>(getKey, {
    fetcher: (...args: ["DESC" | "ASC", number, number]) =>
      subgraphService.getAuctions(...args),
  });

  console.log({ data, error });

  return (
    <div>
      <Header />
      {data.map((auctions) =>
        auctions.map((auction) => (
          <div key={auction.noun.id}>
            <h3>{auction.noun.id}</h3>
            <BidTable bids={auction.bids} />
          </div>
        ))
      )}
      <button onClick={() => setSize(size + 1)}>NEXT PAGE</button>
    </div>
  );
};

export default Home;
