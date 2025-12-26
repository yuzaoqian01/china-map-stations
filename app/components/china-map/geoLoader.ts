import type { GeoJSON, GeoFeature } from "./types";

// 阿里 DataV GeoJSON CDN
const DATAV_CDN = "https://geo.datav.aliyun.com/areas_v3/bound";

// 缓存已加载的地图数据
const geoCache = new Map<string, GeoJSON>();

// 动态 adcode 映射缓存（从 GeoJSON 提取）
const dynamicAdcodeMap = new Map<string, string>();

/**
 * 加载地图 GeoJSON 数据
 * @param adcode 行政区划代码，100000 为全国
 */
export async function loadGeoJSON(adcode: string = "100000"): Promise<GeoJSON> {
  // 检查缓存
  if (geoCache.has(adcode)) {
    return geoCache.get(adcode)!;
  }

  const url = `${DATAV_CDN}/${adcode}_full.json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load GeoJSON for adcode: ${adcode}`);
  }

  const data = await response.json();
  geoCache.set(adcode, data);

  // 提取子区域 adcode 到动态映射
  extractAdcodesFromGeoJSON(data);

  return data;
}

/**
 * 从 GeoJSON 提取子区域 adcode 到动态映射
 */
function extractAdcodesFromGeoJSON(geoData: GeoJSON): void {
  if (!geoData.features) return;

  geoData.features.forEach((feature: GeoFeature) => {
    const { name, adcode } = feature.properties;
    if (name && adcode) {
      dynamicAdcodeMap.set(name, String(adcode));
    }
  });
}

/**
 * 省份名称到 adcode 映射（静态）
 */
export const provinceAdcodeMap: Record<string, string> = {
  北京市: "110000",
  天津市: "120000",
  河北省: "130000",
  山西省: "140000",
  内蒙古自治区: "150000",
  辽宁省: "210000",
  吉林省: "220000",
  黑龙江省: "230000",
  上海市: "310000",
  江苏省: "320000",
  浙江省: "330000",
  安徽省: "340000",
  福建省: "350000",
  江西省: "360000",
  山东省: "370000",
  河南省: "410000",
  湖北省: "420000",
  湖南省: "430000",
  广东省: "440000",
  广西壮族自治区: "450000",
  海南省: "460000",
  重庆市: "500000",
  四川省: "510000",
  贵州省: "520000",
  云南省: "530000",
  西藏自治区: "540000",
  陕西省: "610000",
  甘肃省: "620000",
  青海省: "630000",
  宁夏回族自治区: "640000",
  新疆维吾尔自治区: "650000",
  台湾省: "710000",
  香港特别行政区: "810000",
  澳门特别行政区: "820000",
};

/**
 * 根据区域名称获取 adcode
 * 优先从动态映射获取（市/区级），再从静态省份映射获取
 */
export function getAdcodeByName(name: string): string | undefined {
  // 1. 先从动态映射查找（市/区级）
  if (dynamicAdcodeMap.has(name)) {
    return dynamicAdcodeMap.get(name);
  }

  // 2. 从静态省份映射查找
  if (provinceAdcodeMap[name]) {
    return provinceAdcodeMap[name];
  }

  // 3. 模糊匹配（去掉"省"、"市"、"区"等后缀）
  const cleanName = name.replace(/省|市|自治区|特别行政区|区|县/g, "");
  
  // 动态映射模糊匹配
  for (const [key, value] of dynamicAdcodeMap.entries()) {
    const cleanKey = key.replace(/省|市|自治区|特别行政区|区|县/g, "");
    if (cleanKey.includes(cleanName) || cleanName.includes(cleanKey)) {
      return value;
    }
  }

  // 静态映射模糊匹配
  for (const [key, value] of Object.entries(provinceAdcodeMap)) {
    const cleanKey = key.replace(/省|市|自治区|特别行政区/g, "");
    if (cleanKey.includes(cleanName) || cleanName.includes(cleanKey)) {
      return value;
    }
  }

  return undefined;
}

/**
 * 从 GeoJSON features 中直接获取 adcode
 */
export function getAdcodeFromFeature(feature: GeoFeature): string | undefined {
  const adcode = feature.properties?.adcode;
  return adcode ? String(adcode) : undefined;
}
