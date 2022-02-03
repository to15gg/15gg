import ky, { HTTPError } from "ky";
import { getAutoCompleteList } from "lib/autocomplete";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { prismaEdge } from "utils/prisma-edge";
import { Prisma, QueueType } from "@15gg/prisma/edge";
import riotClient from "utils/riot-client";

type Summoner = {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
};

type League = {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const keyword = req.nextUrl.searchParams.get("keyword") as string;

  event.waitUntil(registerSummoners(keyword));

  return NextResponse.next();
}

async function getLeagues(summonerEncryptedId: string) {
  const url = `league/v4/entries/by-summoner/${summonerEncryptedId}`;

  try {
    return await riotClient(url).json<League[]>();
  } catch (error) {
    if (error instanceof HTTPError) {
      console.log(
        "fail api",
        error.response.status,
        await error.response.json()
      );
    }

    return [];
  }
}

async function registerSummoners(keyword: string) {
  // console.log(prismaEdge);
  console.log((prismaEdge as any)._transactionId);

  const data = await getAutoCompleteList(keyword);

  const names = data.map(({ name }) => name);

  const summoners = await prismaEdge.summoner.findMany({
    where: {
      name: { in: names },
    },
  });

  const unregisteredNames = names.filter(
    (name) => summoners.find((summoner) => summoner.name === name) === undefined
  );

  const promises = unregisteredNames.map(async (name) => {
    const url = `summoner/v4/summoners/by-name/${name}`;
    const summoner = await riotClient(url).json<Summoner>();

    const {
      id: summonerEncryptedId,
      name: summonerName,
      accountId,
      puuid,
      profileIconId,
      revisionDate,
      summonerLevel,
    } = summoner;

    const leagues = await getLeagues(summonerEncryptedId);

    const data: Prisma.SummonerCreateInput = {
      encryptedId: summonerEncryptedId,
      accountId,
      puuid,
      name: summonerName,
      profileIconId,
      revisionDate: new Date(revisionDate),
      level: summonerLevel,
      leagues: {
        createMany: {
          skipDuplicates: true,
          data: leagues
            .filter(({ queueType }: any) =>
              [QueueType.RANKED_SOLO_5x5, QueueType.RANKED_TEAM_5x5].includes(
                queueType
              )
            )
            .map(
              ({
                summonerName,
                summonerId,
                leaguePoints,
                miniSeries,
                ...leagueData
              }: any) => {
                return {
                  points: leaguePoints,
                  promotionTarget: miniSeries?.target,
                  promotionWins: miniSeries?.wins,
                  promotionLosses: miniSeries?.losses,
                  promotionProgress: miniSeries?.progress,
                  ...leagueData,
                };
              }
            ),
        },
      },
    };

    try {
      await prismaEdge.summoner.upsert({
        where: { accountId: data.accountId },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.meta !== undefined && "target" in error.meta) {
          console.log((error.meta as { target: string[] })?.target);
        }

        console.log("fail create", JSON.stringify(data), error);
      }
    }
  });

  return Promise.all(promises).catch((error) => {
    if (error instanceof HTTPError) {
      if (error.response.status !== 404) {
        console.log("httpError", error);
      }
    } else {
      console.log("unknownError", error);
    }
  });
}
