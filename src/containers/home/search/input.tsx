import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { useRouter } from "next/router";
import { AutocompleteList } from "pages/api/autocomplete";
import { Keys } from "../../../utils/keyboard";
import {
  isOpenAtom,
  keywordAtom,
  previewAtom,
  selectedIndexAtom,
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
  const [selectedIndex, setSelectedIndex] = useAtom(selectedIndexAtom);
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [keyword, updateKeyword] = useAtom(keywordAtom);
  const router = useRouter();

  const lastIndex = items.length - 1;

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
        setIsOpen(true);
        setSelectedIndex(-1);
      }}
      onBlur={() => {
        setIsOpen(false);
        updateKeyword(items[selectedIndex]?.name ?? keyword);
      }}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) {
          return;
        }
        switch (event.key) {
          case Keys.ArrowDown:
            event.preventDefault();
            if (isOpen && items.length > 0) {
              setSelectedIndex((index) => {
                console.log(index, index !== lastIndex ? index + 1 : 0);

                return index !== lastIndex ? index + 1 : 0;
              });
            } else {
              if (items.length > 0) {
                setIsOpen(true);
                setSelectedIndex(-1);
              }
            }
            break;
          case Keys.ArrowUp:
            event.preventDefault();
            if (isOpen) {
              setSelectedIndex((index) =>
                index > 0 ? index - 1 : Math.max(lastIndex, 0)
              );
            } else {
              setIsOpen(true);
              setSelectedIndex(-1);
            }
            break;
          case Keys.Enter:
            event.preventDefault();
            router.push(`/search/${items[selectedIndex]?.name ?? keyword}`);
            setIsOpen(false);
            break;

          case Keys.Escape:
            event.preventDefault();
            setIsOpen(false);
            updateKeyword(items[selectedIndex]?.name ?? keyword);
            // 메뉴 닫기
            break;
        }
      }}
    />
  );
}