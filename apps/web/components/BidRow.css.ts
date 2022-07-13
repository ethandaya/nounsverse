import { style } from "@vanilla-extract/css";
import { atoms, vars } from "degen";
import { responsiveGridSizes } from "../utils/table";
import { mq } from "../utils/breakpoints";

export const BidRowRoot = style([
  style({
    display: "none",
    gridTemplateColumns: responsiveGridSizes.sm,
    gap: "1",
    "@media": {
      [mq("md")]: {
        display: "grid",
        gridTemplateColumns: responsiveGridSizes.md,
      },
      [mq("lg")]: {
        display: "grid",
        gridTemplateColumns: responsiveGridSizes.lg,
      },
      [mq("xl")]: {
        display: "grid",
        gridTemplateColumns: responsiveGridSizes.xl,
      },
    },
  }),
]);

export const BidRowColContainer = style([
  atoms({
    display: "flex",
    flexDirection: "column",
  }),
  style({
    gap: vars.space["1"],
  }),
]);
