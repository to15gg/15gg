import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const getServerSideProps: GetServerSideProps<{
  initialUsername: string;
}> = async (context) => {
  return {
    props: {
      initialUsername: (context.query["username"] as string) ?? "",
    },
  };
};

const onPasteUsername: React.ClipboardEventHandler<HTMLInputElement> = (
  event
) => {
  const patterns = [
    /^(.*?)\: .*$/i, // Chat
    /^(.*?)님이 (?:방|그룹)에 참가했습니다\.?$/i, // ko_KR
    /^(.*?)님이 로비에 참가하셨습니다\.?$/i, // ko_KR
  ];

  const pastedData = event.clipboardData.getData("text/plain");

  const summonerNames = pastedData
    .split(/\n/)
    .map((line) =>
      line.replace(patterns.find((pattern) => line.match(pattern)) ?? "", "$1")
    );

  const newText =
    summonerNames.length === 0
      ? pastedData
      : Array.from(new Set(summonerNames)).join();

  const input = event.currentTarget;

  const prevText = input.value;

  const selectionStart = input.selectionStart ?? 0;
  const selectionEnd = input.selectionEnd ?? 0;

  event.currentTarget.value =
    prevText.substring(0, selectionStart) +
    newText +
    prevText.substring(selectionEnd);

  const selectIndex = selectionStart + newText.length;

  input.setSelectionRange(selectIndex, selectIndex);

  event.preventDefault();
};

function Search() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const onSubmit: SubmitHandler<any> = (data) =>
    router.push(`/search/${data.username}`);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 items-center justify-center"
    >
      <div className="relative w-full max-w-[850px] flex items-center justify-center">
        <div className="absolute left-0 text-9xl text-[#47C2A4] text-right md:hidden xl:block">
          <p>15</p>
          <p>GG</p>
        </div>
        <div className=" flex z-10 w-full max-w-[550px] h-[70px] py-[15px] pl-[30px] pr-[5px] bg-[#F8F8F8]/80 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
          <input
            type="text"
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent focus:outline-none"
            placeholder="Search 15GG"
            onPaste={onPasteUsername}
            {...register("username")}
          />
          <button
            type="submit"
            className="w-[80px] h-[40px] bg-[#47C2A4] text-[white] focus:outline-none"
          >
            검색
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 w-full px-[250px]">
        <Search />
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
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
