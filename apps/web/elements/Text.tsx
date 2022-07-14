import * as React from "react";
import * as styles from "./Text.css";
import { Box, BoxProps } from "degen";
import clsx from "clsx";

// TODO - Augment Box to accept element type??
type Props = {
  className?: string;
  align?: BoxProps["textAlign"];
  as?:
    | "code"
    | "div"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "label"
    | "p"
    | "span"
    | "a";
  children?: React.ReactNode;
  color?: BoxProps["color"];
  font?: BoxProps["fontFamily"];
  letterSpacing?: BoxProps["letterSpacing"];
  lineHeight?: BoxProps["lineHeight"];
  size?: BoxProps["fontSize"];
  transform?: BoxProps["textTransform"];
  weight?: BoxProps["fontWeight"];
  whiteSpace?: BoxProps["whiteSpace"];
  wordBreak?: BoxProps["wordBreak"];
  padding?: BoxProps["padding"];
  paddingY?: BoxProps["paddingY"];
  paddingX?: BoxProps["paddingX"];
  paddingTop?: BoxProps["paddingTop"];
  paddingBottom?: BoxProps["paddingBottom"];
  marginX?: BoxProps["marginX"];
  marginY?: BoxProps["marginY"];
  margin?: BoxProps["margin"];
  marginBottom?: BoxProps["marginBottom"];
  marginTop?: BoxProps["marginTop"];
  marginLeft?: BoxProps["marginLeft"];
  marginRight?: BoxProps["marginRight"];
  minHeight?: BoxProps["minHeight"];
  cursor?: BoxProps["cursor"];
  width?: BoxProps["width"];
  flex?: BoxProps["flex"];
  display?: BoxProps["display"];
} & styles.TextVariants &
  React.HTMLAttributes<HTMLDivElement>;

export const Text = React.forwardRef(
  (
    {
      align,
      as = "div",
      children,
      color = "text",
      ellipsis,
      font = "sans",
      letterSpacing,
      lineHeight,
      size,
      transform,
      variant = "base",
      weight,
      whiteSpace,
      wordBreak,
      underline,
      className = "",
      ...rest
    }: Props,
    ref: React.Ref<HTMLElement>
  ) => {
    return (
      <Box
        as={as}
        ref={ref}
        className={clsx(
          styles.variants({
            variant,
            ellipsis,
            underline,
          }),
          className
        )}
        color={color}
        fontFamily={font}
        fontSize={size}
        fontWeight={weight}
        letterSpacing={letterSpacing}
        lineHeight={lineHeight}
        textAlign={align}
        textTransform={transform}
        whiteSpace={whiteSpace}
        wordBreak={wordBreak}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

Text.displayName = "Text";
