import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import { Header } from "../components/Header";
import { Auction } from "../services/noun.service";
import subgraphService from "../services/subgraph.service";

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
    size,
    setSize,
  } = useSWRInfinite<Auction[]>(getKey, {
    fetcher: (...args: ["DESC" | "ASC", number, number]) =>
      subgraphService.getAuctions(...args),
  });

  console.log({ data });

  return (
    <div>
      <Header />
      {data.map((auctions) =>
        auctions.map((auction) => (
          <pre key={auction.noun.id}>{JSON.stringify(auction, null, 2)}</pre>
        ))
      )}
      <button onClick={() => setSize(size + 1)}>NEXT PAGE</button>
    </div>
  );
};

export default Home;
