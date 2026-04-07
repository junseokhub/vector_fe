import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilNexus />
        <Toaster position="top-center" />
        <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;