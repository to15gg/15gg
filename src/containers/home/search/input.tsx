import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useDebounce } from "hooks";
import { AutocompleteList } from "pages/api/autocomplete";
import { Keys } from "utils/keyboard";

import {
  isOpenAutocompleteAtom,
  keywordAtom,
  autocompleteAtom,
  highlightedIndexAtom,
} from "./store";

const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (event) => {
  event.preventDefault();

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
};

export default function Input() {
  const router = useRouter();
  const [keyword, updateKeyword] = useState("");
  const searchKeyword = useDebounce(keyword, 150);
  const updateSearchKeyword = useUpdateAtom(keywordAtom);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const updateHighlightedIndex = useUpdateAtom(highlightedIndexAtom);
  const items = useAtomValue(autocompleteAtom) as AutocompleteList;
  const [isOpenAutocomplete, setIsOpenAutocomplete] = useAtom(
    isOpenAutocompleteAtom
  );

  useEffect(() => {
    updateSearchKeyword(searchKeyword);
  }, [searchKeyword, updateSearchKeyword]);

  const lastIndex = items.length - 1;
  const incrementIndex = () => {
    const callback = (index: number) => (index < lastIndex ? index + 1 : 0);
    setSelectedIndex(callback);
    updateHighlightedIndex(callback);
  };
  const decrementIndex = () => {
    const callback = (index: number) =>
      index > 0 ? index - 1 : Math.max(lastIndex, 0);
    setSelectedIndex(callback);
    updateHighlightedIndex(callback);
  };
  const resetIndex = () => {
    setSelectedIndex(-1);
    updateHighlightedIndex(-1);
  };

  const openAutocomplete = () => {
    setIsOpenAutocomplete(true);
  };
  const closeAutocomplete = () => {
    setIsOpenAutocomplete(false);
    resetIndex();
  };

  const actions = {
    [Keys.ArrowDown]: () =>
      isOpenAutocomplete ? incrementIndex() : openAutocomplete(),
    [Keys.ArrowUp]: () =>
      isOpenAutocomplete ? decrementIndex() : openAutocomplete(),
    [Keys.Enter]: () => {
      router.push(`/search/${keyword}`);
      closeAutocomplete();
    },
    [Keys.Escape]: () => {
      closeAutocomplete();
    },
  };

  return (
    <input
      type="text"
      spellCheck="false"
      autoComplete="off"
      className="flex-1 bg-transparent"
      placeholder="Search 15GG"
      onPaste={onPaste}
      value={items[selectedIndex]?.name ?? keyword}
      onChange={(event) => {
        updateKeyword(event.currentTarget.value);
        resetIndex();
        openAutocomplete();
      }}
      onBlur={closeAutocomplete}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) {
          return;
        }

        switch (event.key) {
          case Keys.ArrowDown:
          case Keys.ArrowUp:
          case Keys.Enter:
          case Keys.Escape:
            event.preventDefault();
            actions[event.key]();
        }
      }}
    />
  );
}
