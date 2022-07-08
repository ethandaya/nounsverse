import { useActiveAuction } from "../hooks/useActiveAuction";

export function Header() {
  const { auction } = useActiveAuction();

  return (
    <header>
      <h3>Nouns</h3>
      <h5>Live Auction </h5>
      <h5>{auction?.noun.id}</h5>
      <h5>Bids: {auction?.bids.length}</h5>
      <h5>Ends In: {auction?.endTime}</h5>
    </header>
  );
}
