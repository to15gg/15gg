import { type AutocompleteList, getAutoCompleteList } from "lib/autocomplete";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutocompleteList>
) {
  const keyword = req.query.keyword as string;

  const data = await getAutoCompleteList(keyword);

  if (data.length === 0) return;

  const names = data.map(({ name }) => name);

  const summoners = await prisma.summoner.findMany({
    where: {
      name: { in: names },
      leagues: { some: { queueType: "RANKED_SOLO_5x5" } },
    },
    include: {
      leagues: true,
    },
  });

  const result: AutocompleteList = data.map((item) => {
    const summoner = summoners.find((summoner) => summoner.name === item.name);

    if (summoner !== undefined && summoner.leagues.length > 0) {
      const { wins, losses } = summoner.leagues[0];
      const total = wins + losses;
      return {
        ...item,
        winningPercentage: ((wins / total) * 100).toFixed(2),
      };
    } else {
      return item;
    }
  });

  return res.json(result);
}
