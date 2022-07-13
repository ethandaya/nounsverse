import { style } from "@vanilla-extract/css";
import { responsiveGridSizes } from "../utils/table";
import { mq } from "../utils/breakpoints";

export const BidTableHeaderRoot = style({
  display: "none",
  gridTemplateColumns: responsiveGridSizes.sm,
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
});
