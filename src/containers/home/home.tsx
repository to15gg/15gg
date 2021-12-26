import { useUpdateAtom } from "jotai/utils";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";

import Search from "./search";
import { keywordAtom } from "./search/store";

export default function Home() {
  const updateKeyword = useUpdateAtom(keywordAtom);

  useEffect(() => {
    return () => updateKeyword("");
  });

  return (
    <div className="center flex-col min-h-screen">
      <Head>
        <title>15GG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="center flex-1 w-full">
        <div className="relative center flex-1 max-w-[127.5rem]">
          <div className="flex flex-1 justify-between">
            <Image
              src="/bg_logo_15_210.svg"
              alt="15"
              width={210}
              height={120}
            />
            <Image
              src="/bg_logo_GG_210.svg"
              alt="GG"
              width={210}
              height={120}
            />
          </div>
          <Search />
        </div>
      </main>

      <footer className="center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  );
}
