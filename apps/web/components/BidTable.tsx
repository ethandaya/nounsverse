import { Bid } from "../services/interfaces/noun.service";
import { BidRow } from "./BidRow";
import { Box, vars } from "degen";
import { Text } from "../elements/Text";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";

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
  const [showMoreBids, setShowMoreBids] = useState<boolean>(false);
  return (
    <Box marginBottom="6">
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
        .slice(0, showMoreBids ? bids.length : 7)
        .map((bid, idx) => (
          <BidRow key={idx} bid={bid} />
        ))}
      {bids.length > 7 && (
        <Box
          width="auto"
          display="flex"
          alignItems="center"
          cursor="pointer"
          onClick={() => setShowMoreBids(!showMoreBids)}
        >
          <Text variant="label" marginRight="0.5">
            {showMoreBids ? "Collapse" : "View More Bids"}
          </Text>
          {showMoreBids ? (
            <ChevronUp color={vars.colors.textTertiary} size={16} />
          ) : (
            <ChevronDown color={vars.colors.textTertiary} size={16} />
          )}
        </Box>
      )}
    </Box>
  );
}
