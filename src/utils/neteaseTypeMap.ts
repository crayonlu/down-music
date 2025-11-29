import { type NetEaseSearchType } from "@/types/search";

const typeMap: Record<NetEaseSearchType, string> = {
  1: "单曲",
  10: "专辑",
  100: "歌手",
  1000: "歌单",
  1002: "用户",
  1004: "MV",
  1006: "歌词",
  1009: "电台",
  1014: "视频",
  1018: "综合",
  2000: "声音",
};

const typeReverseMap: Record<string, NetEaseSearchType> = {
  单曲: 1,
  专辑: 10,
  歌手: 100,
  歌单: 1000,
  用户: 1002,
  MV: 1004,
  歌词: 1006,
  电台: 1009,
  视频: 1014,
  综合: 1018,
  声音: 2000,
};

const getTypeByName = (name: string): NetEaseSearchType | undefined => typeReverseMap[name];
const getNameByType = (type: NetEaseSearchType): string => typeMap[type];

export { typeMap, typeReverseMap, getTypeByName, getNameByType };
