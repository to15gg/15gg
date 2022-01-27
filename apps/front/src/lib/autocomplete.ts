import ky from "ky";

type OPGGAutocompleteResponse = {
  sections: {
    groups: {
      type: string;
      items: {
        level: number;
        name: string;
        profileIconUrl: string;
        tierRank: { tierRank: string; lp: number };
      }[];
    }[];
  }[];
};

export type AutocompleteItem = {
  level: number;
  name: string;
  profileIconUrl: string;
  tierRank: string | null;
  lp: number | null;
  winningPercentate?: number;
};

export type AutocompleteList = AutocompleteItem[];

export async function getAutoCompleteList(keyword: string) {
  const { sections } = await ky(
    `https://www.op.gg/ajax/autocomplete.json/keyword=${encodeURI(keyword)}`,
    { searchParams: { api_key: process.env.RIOT_API_KEY as string } }
  ).json<OPGGAutocompleteResponse>();

  const data: AutocompleteList = sections
    .map(({ groups }) =>
      groups
        .filter((group) => group.type === "SUMMONER")
        .map(({ items }) =>
          items
            .filter(({ name }) => name.replaceAll(" ", "").length > 1)
            .map(
              ({
                level,
                name,
                profileIconUrl,
                tierRank: { tierRank, lp } = {
                  tierRank: null,
                  lp: null,
                },
              }) => ({
                level,
                name,
                profileIconUrl,
                tierRank,
                lp,
              })
            )
        )
        .flat()
    )
    .flat();

  return data;
}
