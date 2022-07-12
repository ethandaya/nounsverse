import { style } from "@vanilla-extract/css";
import { breakpoints } from "degen";
import { responsiveTableHeaderSizes } from "../utils/table";

export const auctionHero = style({
  gridTemplateColumns: responsiveTableHeaderSizes.sm,
  "@media": {
    [`(min-width: ${breakpoints.sm}px)`]: {
      gridTemplateColumns: responsiveTableHeaderSizes.sm,
    },
    [`(min-width: ${breakpoints.md}px)`]: {
      gridTemplateColumns: responsiveTableHeaderSizes.md,
    },
    [`(min-width: ${breakpoints.lg}px)`]: {
      gridTemplateColumns: responsiveTableHeaderSizes.lg,
    },
    [`(min-width: ${breakpoints.xl}px)`]: {
      gridTemplateColumns: responsiveTableHeaderSizes.xl,
    },
  },
});
