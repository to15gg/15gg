import { useAtomValue } from "jotai/utils";
import { useRouter } from "next/router";
import React from "react";

import Input from "./input";
import { keywordAtom } from "./store";

export default function Form() {
  const keyword = useAtomValue(keywordAtom);
  const router = useRouter();

  return (
    <form
      onSubmit={() => router.push(`/search/${keyword}`)}
      className="center flex-1"
    >
      <Input />
      <button
        type="submit"
        className="w-[9rem] h-[5rem] rounded-[5px] teal"
        disabled={keyword.trim() === ""}
      >
        검색
      </button>
    </form>
  );
}
