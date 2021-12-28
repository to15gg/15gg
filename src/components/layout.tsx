import Head from "next/head";

import Background from "./background";
import Footer from "./footer";

type LayoutProps = React.PropsWithChildren<{}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="center flex-col min-h-screen overflow-y-auto">
      <Head>
        <title>15GG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background />
      <main className="flex flex-1 justify-center self-stretch">
        {children}
      </main>
      <Footer />
    </div>
  );
}
