import { Breakpoint } from "degen/dist/types/css/breakpoints";
import { breakpoints } from "degen";

export function mq(
  breakpoint: Breakpoint,
  constraint: string = "min-width"
): string {
  return `(${constraint}: ${breakpoints[breakpoint]}px)`;
}
