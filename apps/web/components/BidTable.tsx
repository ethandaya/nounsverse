import { Bid } from "../services/noun.service";
import { BidRow } from "./BidRow";
import styles from "./BidTable.module.scss";

type BidTableProps = {
  bids: Bid[];
};

const columns = [
  { col: "1fr", label: "Block No." },
  { col: "1fr", label: "Tx Hash" },
  { col: "2fr", label: "Bidder" },
  { col: "1fr", label: "Bid" },
  { col: "1fr", label: "Eth Balance" },
  { col: "1fr", label: "Prev Bids" },
  { col: "1fr", label: "When" },
];

export const columnTemplate = columns.map((c) => c.col).join(" ");

export function BidTable({ bids }: BidTableProps) {
  return (
    <div className={styles.BidTableRoot}>
      <div
        className={styles.TableHeaderRoot}
        style={{
          gridTemplateColumns: columnTemplate,
        }}
      >
        {columns.map((col, idx) => (
          <h6 key={idx} className={styles.TableHeaderItem}>
            {col.label}
          </h6>
        ))}
      </div>
      {bids.map((bid, idx) => (
        <BidRow key={idx} bid={bid} />
      ))}
    </div>
  );
}
