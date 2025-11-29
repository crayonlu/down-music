import { apiClient } from "../base";

async function getLyrics(id: number): Promise<string> {
  const response = await apiClient("netease").get("/lyric", {
    params: {
      id,
    },
  });
  return response.data.lrc.lyric;
}

export { getLyrics }
