import { apiClient } from "../base";
import type { KuGouSearchType } from "../../types/search";

interface SearchRes {
  total: number
  list: Array<{
    Image: string
    AlbumID: string
    AlbumName: string
    FileHash: string
    Res: {
      FileSize: number
      TimeLength: number
    }
    Singer: Array<{
      id: number
      name: string
    }>
    Duration: number
    OriSongName: string
  }>
}

async function search(
  keywords: string,
  page: number,
  pagesize: number,
  type: KuGouSearchType
): Promise<SearchRes> {
  const response = await apiClient("kugou").get("/search", {
    params: {
      keyword: keywords,
      page,
      pagesize,
      type,
    },
  });
  return response.data.data;
}

export { search }
export type { SearchRes }
