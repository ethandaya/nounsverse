import { Bid } from "../services/noun.service";
import { BidRow } from "./BidRow";

type BidTableProps = {
  bids: Bid[];
};

export function BidTable({ bids }: BidTableProps) {
  return (
    <div>
      {bids.map((bid, idx) => (
        <BidRow key={idx} bid={bid} />
      ))}
    </div>
  );
}
