import { atom } from "jotai";
import { atomWithQuery } from "jotai/query";
import ky from "ky";

import type { AutocompleteList } from "lib/autocomplete";

const initialData: AutocompleteList = [];

export const keywordAtom = atom("");
export const autocompleteAtom = atomWithQuery((get) => ({
  enabled: get(keywordAtom).trim() !== "",
  initialData,
  queryKey: ["users", get(keywordAtom)],
  queryFn: async ({ queryKey: [, keyword] }) => {
    const data = await ky(`/api/autocomplete`, {
      searchParams: { keyword: keyword as string },
    }).json<AutocompleteList>();

    return data;
  },
}));
export const isOpenAutocompleteAtom = atom(false);
export const highlightedIndexAtom = atom(-1);
