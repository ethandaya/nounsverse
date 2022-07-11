import { style } from "@vanilla-extract/css";
import { atoms, vars } from "degen";

export const BidRowRoot = style({
  display: "grid",
});

export const BidRowColContainer = style([
  atoms({
    display: "flex",
    flexDirection: "column",
  }),
  style({
    gap: vars.space["1"],
  }),
]);
