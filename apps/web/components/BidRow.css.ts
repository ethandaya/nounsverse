import { style } from "@vanilla-extract/css";
import { atoms, breakpoints, vars } from "degen";
import { responsiveGridSizes } from "../utils/table";

export const BidRowRoot = style([
  style({
    display: "grid",
    gridTemplateColumns: responsiveGridSizes.sm,
    gap: "1",
    "@media": {
      [`(min-width: ${breakpoints.sm}px)`]: {
        gridTemplateColumns: responsiveGridSizes.sm,
      },
      [`(min-width: ${breakpoints.md}px)`]: {
        gridTemplateColumns: responsiveGridSizes.md,
      },
      [`(min-width: 1000px)`]: {
        gridTemplateColumns: responsiveGridSizes.md,
      },
      [`(min-width: ${breakpoints.lg}px)`]: {
        gridTemplateColumns: responsiveGridSizes.lg,
      },
      [`(min-width: ${breakpoints.xl}px)`]: {
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
