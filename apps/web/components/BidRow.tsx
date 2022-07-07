import { Bid } from "../services/noun.service";
import { useBalance } from "wagmi";

type BidRowProps = {
  bid: Bid;
};

export function BidRow({ bid }: BidRowProps) {
  const { data } = useBalance({ addressOrName: bid.bidder.address });
  return (
    <li>
      {bid.bidder.address} — {data?.formatted}
    </li>
  );
}
