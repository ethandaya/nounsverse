import { useActiveAuction } from "../hooks/useActiveAuction";

export function Header() {
  const { auction, isLoading } = useActiveAuction();
  return (
    <header>
      {isLoading && <span>loading</span>}
      <pre>{JSON.stringify(auction, null, 2)}</pre>
    </header>
  );
}
