import { Bid } from "../services/noun.service";
import { useBalance } from "wagmi";
import styles from "./BidRow.module.scss";
import { columnTemplate } from "./BidTable";
import { clsx } from "clsx";
import { shortenAddress, shortenTx } from "../utils/address";

type BidRowProps = {
  bid: Bid;
};

export function BidRow({ bid }: BidRowProps) {
  const { data } = useBalance({ addressOrName: bid.bidder.address });
  console.log({ bid });
  return (
    <div
      className={styles.BidRow}
      style={{
        gridTemplateColumns: columnTemplate,
      }}
    >
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>{bid.blockNumber}</h5>
      </div>
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>{shortenTx(bid.id, 4)}</h5>
      </div>
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>
          {shortenAddress(bid.bidder.address, 4)}
        </h5>
      </div>
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>{bid.amount}</h5>
      </div>
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>ETH {data?.formatted}</h5>
      </div>
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>...</h5>
      </div>
      <div className={styles.BidRowItem}>
        <h5 className={styles.BidRowItemLead}>{bid.blockTimestamp}</h5>
      </div>
    </div>
  );
}
