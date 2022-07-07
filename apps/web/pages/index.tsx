import type { NextPage } from "next";
import { useAuction } from "../hooks/useAuction";
import { Header } from "../components/Header";

const Home: NextPage = () => {
  const { auction, isLoading } = useAuction("1");

  return (
    <div>
      <Header />
      {isLoading && <span>loading</span>}
      <pre>{JSON.stringify(auction, null, 2)}</pre>
    </div>
  );
};

export default Home;
