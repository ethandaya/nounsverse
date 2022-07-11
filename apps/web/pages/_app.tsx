import "degen/styles";
import "../styles/index.css";
import "../styles/theme.scss";
import { ThemeProvider } from "degen";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "../utils/network";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ServiceCtxProvider } from "../services/ServiceContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider defaultMode="dark">
          <ServiceCtxProvider>
            <Component {...pageProps} />
          </ServiceCtxProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
