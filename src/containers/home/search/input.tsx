import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useRouter } from "next/router";
import { useState } from "react";

import { AutocompleteList } from "pages/api/autocomplete";
import { Keys } from "utils/keyboard";

import {
  isOpenAtom,
  keywordAtom,
  previewAtom,
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
  const items = useAtomValue(previewAtom) as AutocompleteList;
  const updateHighlightedIndex = useUpdateAtom(highlightedIndexAtom);
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [keyword, updateKeyword] = useAtom(keywordAtom);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  const resetIndex = () => {
    setSelectedIndex(-1);
    updateHighlightedIndex(-1);
  };
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    resetIndex();
  };

  const lastIndex = items.length - 1;
  const incrementIndex = () => {
    const callback = (index: number) => (index !== lastIndex ? index + 1 : 0);
    setSelectedIndex(callback);
    updateHighlightedIndex(callback);
  };
  const decrementIndex = () => {
    const callback = (index: number) =>
      index > 0 ? index - 1 : Math.max(lastIndex, 0);
    setSelectedIndex(callback);
    updateHighlightedIndex(callback);
  };

  return (
    <input
      type="text"
      spellCheck="false"
      autoComplete="off"
      className="flex-1 ml-[1rem] bg-transparent font-light text-almost-black"
      placeholder="소환사 검색"
      onPaste={onPaste}
      value={items[selectedIndex]?.name ?? keyword}
      onChange={(event) => {
        updateKeyword(event.currentTarget.value);
        resetIndex();
        open();
      }}
      onBlur={() => {
        close();
      }}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) {
          return;
        }
        switch (event.key) {
          case Keys.ArrowDown:
            event.preventDefault();
            isOpen && items.length > 0 ? incrementIndex() : open();
            break;
          case Keys.ArrowUp:
            event.preventDefault();
            isOpen ? decrementIndex() : open();
            break;
          case Keys.Enter:
            event.preventDefault();
            router.push(`/search/${keyword}`);
            close();
            break;
          case Keys.Escape:
            event.preventDefault();
            close();
            // 메뉴 닫기
            break;
        }
      }}
    />
  );
}
