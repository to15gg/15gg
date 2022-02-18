import ky from "ky";

const riotClient = ky.extend({
  prefixUrl: "https://kr.api.riotgames.com/lol",
  searchParams: { api_key: process.env.RIOT_API_KEY as string },
  hooks: {
    afterResponse: [
      (request, options, response) => {
        if (response.status === 429) {
          // 예외처리
        }
      },
    ],
  },
});

export default riotClient;
