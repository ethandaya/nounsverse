import { Bid } from "../services/interfaces/noun.service";
import { BidRow } from "./BidRow";
import { Box } from "degen";
import { Text } from "../elements/Text";

type BidTableProps = {
  bids: Bid[];
};

const columns = [
  { col: "1fr", label: "Block No." },
  { col: "1fr", label: "Tx Hash" },
  { col: "2fr", label: "Bidder" },
  { col: "1fr", label: "Bid" },
  { col: "1fr", label: "Eth Balance" },
  { col: "1fr", label: "Prev. Bids" },
  { col: "1fr", label: "When" },
];

export const columnTemplate = columns.map((c) => c.col).join(" ");

export function BidTable({ bids }: BidTableProps) {
  return (
    <Box>
      <Box
        display="grid"
        style={{
          gridTemplateColumns: columnTemplate,
        }}
        marginBottom="2"
      >
        {columns.map((col, idx) => (
          <Text variant="label" key={idx}>
            {col.label}
          </Text>
        ))}
      </Box>
      {bids
        .sort((a, b) => b.blockTimestamp - a.blockTimestamp)
        .map((bid, idx) => (
          <BidRow key={idx} bid={bid} />
        ))}
    </Box>
  );
}
