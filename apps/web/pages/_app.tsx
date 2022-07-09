import "degen/styles";
import "../styles/theme.css";
import "../styles/index.css";
import { ThemeProvider } from "degen";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../utils/network";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider defaultMode="dark" defaultAccent="yellow">
          <Component {...pageProps} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
