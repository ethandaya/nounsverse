import { Box, BoxProps } from "degen";
import { clsx } from "clsx";
import { TextCss, TextVariants } from "./Text.css";

type TextProps = BoxProps & TextVariants;

export function Text({
  className,
  children,
  variant = "base",
  ...rest
}: TextProps) {
  return (
    <Box
      className={clsx(
        TextCss({
          variant,
        }),
        className
      )}
      {...rest}
    >
      {children}
    </Box>
  );
}
