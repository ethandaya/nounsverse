import { Breakpoint } from "degen/dist/types/css/breakpoints";

export const responsiveTableHeaderSizes: {
  [key in Breakpoint]: string;
} = {
  sm: "repeat(2, 1fr)",
  md: "2fr repeat(2, 1fr)",
  lg: "2fr repeat(2, 1fr)",
  xl: "2fr repeat(2, 1fr)",
};

export const responsiveGridSizes: {
  [key in Breakpoint]?: string;
} = {
  sm: "1fr",
  md: "repeat(2, 1fr) 2fr repeat(4, 1fr)",
  lg: "repeat(2, 1fr) 2fr repeat(4, 1fr)",
  xl: "repeat(2, 1fr) 2fr repeat(4, 1fr)",
};
