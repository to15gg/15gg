import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import Image from "next/image";
import Link from "next/link";

import { AutocompleteList } from "pages/api/autocomplete";

import {
  isOpenAutocompleteAtom,
  autocompleteAtom,
  highlightedIndexAtom,
} from "./store";

export default function Autocomplete() {
  const [selectedIndex, setSelectedIndex] = useAtom(highlightedIndexAtom);
  const isOpen = useAtomValue(isOpenAutocompleteAtom);
  const items = useAtomValue(autocompleteAtom) as AutocompleteList;

  if (!isOpen || items.length === 0) {
    return null;
  }

  return (
    <div className="relative border-t border-t-[#D9D9D9]">
      <p className="absolute top-[1rem] right-0 text-[10px] font-medium">
        화살표 키로 검색 결과를 이동할 수 있습니다.
      </p>
      <ul className="space-y-[1.5rem] py-[2.5rem]">
        {items.map((item, index) => {
          const { level, lp, name, profileIconUrl, tierRank } = item;
          const backgroundClasses =
            index === selectedIndex ? "bg-teal-400" : "bg-transparent";

          const levelText = `level ${level}`;
          const tierText =
            tierRank === null ? "Unranked" : `${tierRank} ${lp}LP`;

          return (
            <li key={name}>
              <Link href={`/search/${name}`}>
                <a
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center space-x-[2rem] py-[1.5rem] ${backgroundClasses}`}
                >
                  <div className="relative w-[5rem] h-[5rem] rounded-full overflow-hidden">
                    <Image
                      src={`${location.protocol}${profileIconUrl}`}
                      alt="프로필 이미지"
                      layout="fill"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p>{name}</p>
                    <p>{[levelText, tierText].join(" / ")}</p>
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
