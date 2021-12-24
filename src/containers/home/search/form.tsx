import React from "react";
import { keywordAtom } from "./store";
import { useRouter } from "next/router";
import Input from "./input";
import { useAtomValue } from "jotai/utils";

export default function Form() {
  const keyword = useAtomValue(keywordAtom);
  const router = useRouter();

  return (
    <form
      onSubmit={() => router.push(`/search/${keyword}`)}
      className="center flex-1 py-[2rem]"
    >
      <Input />
      <button type="submit" className="w-[80px] h-[40px] rounded-[5px] teal">
        검색
      </button>
    </form>
  );
}
