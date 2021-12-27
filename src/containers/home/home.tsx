import { useUpdateAtom } from "jotai/utils";
import React, { useEffect } from "react";

import Search from "./search";
import { keywordAtom } from "./search/store";

export default function Home() {
  const updateKeyword = useUpdateAtom(keywordAtom);

  useEffect(() => {
    return () => updateKeyword("");
  });

  return <Search />;
}
