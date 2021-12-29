import ky from "ky-universal";
import type { NextApiRequest, NextApiResponse } from "next";

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

export type AutocompleteList = {
  level: number;
  name: string;
  profileIconUrl: string;
  tierRank: string | null;
  lp: number | null;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutocompleteList>
) {
  const keyword = req.query.keyword as string;

  const { sections } = await ky(
    `https://www.op.gg/ajax/autocomplete.json/keyword=${encodeURI(keyword)}`
  ).json<OPGGAutocompleteResponse>();
  const data = sections
    .map(({ groups }) =>
      groups
        .filter((group) => group.type === "SUMMONER")
        .map(({ items }) =>
          items.map(
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

  res.status(200).json(data);
}
