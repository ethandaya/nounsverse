import "degen/styles";
import "../styles/index.css";
import "../styles/theme.scss";
import { ThemeProvider, vars } from "degen";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../utils/network";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider defaultMode="dark" defaultAccent="yellow">
          <NextNProgress color={vars.colors.yellow} />
          <Component {...pageProps} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
