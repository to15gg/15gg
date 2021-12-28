import { useUpdateAtom } from "jotai/utils";
import { useRef } from "react";
import { useOutsideClick } from "rooks";

import Autocomplete from "./autocomplete";
import Form from "./form";
import { highlightedIndexAtom, isOpenAutocompleteAtom } from "./store";

export default function Search() {
  const updateIsOpen = useUpdateAtom(isOpenAutocompleteAtom);
  const updateHighlightedIndex = useUpdateAtom(highlightedIndexAtom);

  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => {
    updateIsOpen(false);
    updateHighlightedIndex(-1);
  });

  return (
    <div className="center flex-1 max-w-[84.75rem]">
      <div ref={ref} className="self-end flex-1 h-[calc(50%_+_4.5rem)] z-10">
        <div className="flex flex-col px-[2rem] rounded-[5px] bg-[white] min-w-min shadow-lg">
          <Form />
          <Autocomplete />
        </div>
      </div>
    </div>
  );
}
