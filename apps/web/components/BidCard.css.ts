import { style } from "@vanilla-extract/css";
import { atoms, vars } from "degen";
import { mq } from "../utils/breakpoints";
import { responsiveGridSizes } from "../utils/table";

export const BidCardRoot = style([
  atoms({
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderColor: "backgroundTertiary",
  }),
  style({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    rowGap: vars.space["1"],
    "@media": {
      [mq("md")]: {
        display: "none",
      },
    },
  }),
]);

export const BidCardLabel = style([
  atoms({
    marginBottom: 1,
  }),
]);
