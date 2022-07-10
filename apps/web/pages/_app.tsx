import "degen/styles";
import "../styles/index.css";
import "../styles/theme.css";
import { ThemeProvider } from "degen";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../utils/network";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider defaultMode="dark">
          <Component {...pageProps} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
