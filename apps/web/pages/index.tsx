import type { NextPage } from "next";
import { useAuction } from "../hooks/useAuction";

const Home: NextPage = () => {
  const { auction, isLoading } = useAuction("1");

  return (
    <div>
      {isLoading && <span>loading</span>}
      <pre>{JSON.stringify(auction, null, 2)}</pre>
    </div>
  );
};

export default Home;
