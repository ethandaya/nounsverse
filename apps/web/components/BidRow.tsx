import { Bid } from "../services/noun.service";
import { useBalance } from "wagmi";
import styles from "./BidRow.module.scss";
import { shortenAddress } from "../utils/address";

type BidRowProps = {
  bid: Bid;
};

export function BidRow({ bid }: BidRowProps) {
  const { data } = useBalance({ addressOrName: bid.bidder.address });
  return (
    <div className={styles.BidRow}>
      <h5>{bid.id}</h5>
      <h5>{shortenAddress(bid.bidder.address)}</h5>
      <h5>{data?.formatted} ETH</h5>
      <h5>{bid.blockTimestamp}</h5>
    </div>
  );
}
