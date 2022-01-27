import { useAtom } from "jotai";
import { useAtomCallback, useAtomValue, useUpdateAtom } from "jotai/utils";
import { useCallback, useState } from "react";

import type { AutocompleteList } from "lib/autocomplete";

import {
  autocompleteAtom,
  highlightedIndexAtom,
  isOpenAutocompleteAtom,
} from "./store";

export function useIsOpenAutocomplete() {
  const updateHighlightedIndex = useUpdateAtom(highlightedIndexAtom);
  const [isOpen, setIsOpen] = useAtom(isOpenAutocompleteAtom);

  return {
    isOpen,
    open() {
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
      updateHighlightedIndex(-1);
    },
  };
}

export function useSelectedIndex() {
  const items = useAtomValue(autocompleteAtom) as AutocompleteList;
  const lastIndex = items.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const increment = useAtomCallback(
    useCallback(
      (get, set) => {
        const highlightedIndex = get(highlightedIndexAtom);
        const nextIndex =
          highlightedIndex < lastIndex ? highlightedIndex + 1 : 0;

        setSelectedIndex(nextIndex);
        set(highlightedIndexAtom, nextIndex);
      },
      [lastIndex]
    )
  );
  const decrement = useAtomCallback(
    useCallback(
      (get, set) => {
        const highlightedIndex = get(highlightedIndexAtom);
        const nextIndex =
          highlightedIndex > 0 ? highlightedIndex - 1 : Math.max(lastIndex, 0);

        setSelectedIndex(nextIndex);
        set(highlightedIndexAtom, nextIndex);
      },
      [lastIndex]
    )
  );
  const reset = useAtomCallback(
    useCallback((_get, set) => {
      setSelectedIndex(-1);
      set(highlightedIndexAtom, -1);
    }, [])
  );

  return {
    selectedIndex,
    increment,
    decrement,
    reset,
  };
}
