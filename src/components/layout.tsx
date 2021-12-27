import Head from "next/head";

import Background from "./background";
import Footer from "./footer";

type LayoutProps = React.PropsWithChildren<{}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="center flex-col min-h-screen  overflow-y-auto">
      <Head>
        <title>15GG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative center flex-1 max-w-[127.5rem] w-full">
        <Background />
        <div className="flex flex-1 self-stretch">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
