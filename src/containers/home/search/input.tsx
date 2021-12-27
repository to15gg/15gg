import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "rooks";

import { AutocompleteList } from "pages/api/autocomplete";
import { Keys } from "utils/keyboard";

import { useIsOpenAutocomplete, useSelectedIndex } from "./hooks";
import { keywordAtom, autocompleteAtom } from "./store";

type Actions = {
  [Keys.ArrowDown]: () => void;
  [Keys.ArrowUp]: () => void;
  [Keys.Enter]: () => void;
  [Keys.Escape]: () => void;
  [key: string]: (() => void) | undefined;
};

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
  const updateSearchKeyword = useDebounce(useUpdateAtom(keywordAtom), 150);
  const { selectedIndex, increment, decrement, reset } = useSelectedIndex();
  const { isOpen, open, close } = useIsOpenAutocomplete();
  const items = useAtomValue(autocompleteAtom) as AutocompleteList;

  useEffect(() => {
    updateSearchKeyword(keyword);
  }, [keyword, updateSearchKeyword]);

  const actions: Actions = {
    [Keys.ArrowDown]: isOpen ? increment : open,
    [Keys.ArrowUp]: isOpen ? decrement : open,
    [Keys.Enter]: () => {
      router.push(`/search/${keyword}`);
      close();
    },
    [Keys.Escape]: close,
  };

  return (
    <input
      type="text"
      spellCheck="false"
      autoComplete="off"
      className="flex-1 ml-[1rem] bg-transparent font-light text-almost-black"
      placeholder="소환사 검색"
      value={items[selectedIndex]?.name ?? keyword}
      onPaste={onPaste}
      onChange={(event) => {
        updateKeyword(event.currentTarget.value);
        reset();
        open();
      }}
      onFocus={open}
      onBlur={(event) => updateKeyword(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (!event.nativeEvent.isComposing) {
          const action = actions[event.key];

          if (action !== undefined) {
            event.preventDefault();
            action();
          }
        }
      }}
    />
  );
}
