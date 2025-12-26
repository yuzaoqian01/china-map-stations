import { useEffect, useRef, useState, useCallback } from "react";
import type {
  ChinaMapProps,
  ChargingStation,
  MapLevel,
  GeoFeature,
} from "./types";
import {
  loadGeoJSON,
  getAdcodeByName,
  getAdcodeFromFeature,
} from "./geoLoader";

// 最大下钻层级：0=全国, 1=省, 2=市, 3=区
const MAX_DRILL_LEVEL = 3;

// 聚合数据类型
interface AggregatedData {
  name: string;
  value: [number, number, number];
  count: number;
  carCount: number;
  ebikeCount: number;
  adcode: string;
}

export function ChinaMap({
  stations = [],
  onStationClick,
  className,
}: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const echartsInstance = useRef<unknown>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapStack, setMapStack] = useState<MapLevel[]>([
    { level: 0, name: "china", adcode: "100000" },
  ]);
  const [loading, setLoading] = useState(true);
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);

  const currentMap = mapStack[mapStack.length - 1];

  // 仅客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 聚合站点数据
  const aggregateStations = useCallback(
    (level: number, features: GeoFeature[]) => {
      // 区级视图（level 3）：显示所有站点
      if (level >= MAX_DRILL_LEVEL) {
        return stations.map((s) => ({
          name: s.name,
          value: [s.lon, s.lat, 1],
          station: s,
        }));
      }

      // 其他层级：按区域聚合，统计各类型数量
      const aggregated: AggregatedData[] = [];

      features.forEach((feature) => {
        const regionName = feature.properties.name;
        const regionAdcode = String(feature.properties.adcode);
        const regionCenter = feature.properties.center;

        // 根据地址匹配站点
        const regionStations = stations.filter((s) => {
          const cleanRegion = regionName.replace(
            /省|市|自治区|特别行政区|区|县/g,
            ""
          );
          return s.address.includes(cleanRegion);
        });

        if (regionStations.length > 0) {
          // 统计各类型数量
          const carCount = regionStations.filter(
            (s) => s.type === "car"
          ).length;
          const ebikeCount = regionStations.filter(
            (s) => s.type === "ebike"
          ).length;

          // 使用区域中心点或站点平均位置
          const centerLon =
            regionCenter?.[0] ||
            regionStations.reduce((sum, s) => sum + s.lon, 0) /
              regionStations.length;
          const centerLat =
            regionCenter?.[1] ||
            regionStations.reduce((sum, s) => sum + s.lat, 0) /
              regionStations.length;

          aggregated.push({
            name: regionName,
            value: [centerLon, centerLat, regionStations.length],
            count: regionStations.length,
            carCount,
            ebikeCount,
            adcode: regionAdcode,
          });
        }
      });

      return aggregated;
    },
    [stations]
  );

  // 初始化和更新图表
  useEffect(() => {
    if (!isClient || !chartRef.current) return;

    let isMounted = true;

    const initChart = async () => {
      setLoading(true);

      try {
        const echarts = await import("echarts");
        const geoData = await loadGeoJSON(currentMap.adcode);

        if (!isMounted || !chartRef.current) return;

        // 保存 features 用于下钻
        setGeoFeatures(geoData.features || []);

        // 注册地图
        const mapName = `map_${currentMap.adcode}`;
        echarts.registerMap(mapName, geoData as never);

        // 初始化或获取实例
        if (!echartsInstance.current) {
          echartsInstance.current = echarts.init(chartRef.current);
        }
        const chart = echartsInstance.current as ReturnType<
          typeof echarts.init
        >;

        // 聚合数据
        const scatterData = aggregateStations(
          currentMap.level,
          geoData.features || []
        );

        // 配置项
        const option = {
          backgroundColor: "transparent",
          tooltip: {
            trigger: "item",
            formatter: (params: {
              seriesType: string;
              data?: {
                station?: ChargingStation;
                count?: number;
                carCount?: number;
                ebikeCount?: number;
              };
              name: string;
            }) => {
              if (params.seriesType === "effectScatter" && params.data) {
                const data = params.data;
                if (data.station) {
                  // 单个充电桩详情
                  const s = data.station;
                  const typeText = s.type === "car" ? "🚗 汽车" : "🛵 电瓶车";
                  const statusText =
                    s.status === "online"
                      ? "🟢 在线"
                      : s.status === "busy"
                      ? "🟡 繁忙"
                      : "🔴 离线";
                  return `
                    <div style="padding: 8px;">
                      <div style="font-weight: bold; margin-bottom: 8px;">${s.name}</div>
                      <div>📍 ${s.address}</div>
                      <div>💰 ${s.price} 元/度</div>
                      <div>🔌 可用: ${s.available}/${s.total}</div>
                      <div>${typeText}</div>
                      <div>${statusText}</div>
                    </div>
                  `;
                }
                // 聚合点详情 - 显示类型数量
                const carCount = data.carCount || 0;
                const ebikeCount = data.ebikeCount || 0;
                return `
                  <div style="padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 8px;">${
                      params.name
                    }</div>
                    <div>🚗 汽车充电桩: ${carCount}</div>
                    <div>🛵 电瓶车充电桩: ${ebikeCount}</div>
                    <div style="margin-top: 4px; color: #888;">总计: ${
                      data.count || 0
                    }</div>
                  </div>
                `;
              }
              return params.name;
            },
          },
          geo: {
            map: mapName,
            roam: true,
            zoom: 1.2,
            center: currentMap.adcode === "100000" ? [104.5, 36] : undefined,
            label: {
              show: true,
              fontSize: 10,
              color: "#666",
            },
            itemStyle: {
              areaColor: "#e0e7ee",
              borderColor: "#8fb1d6",
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                areaColor: "#a8d8ea",
              },
              label: {
                color: "#333",
              },
            },
            select: {
              itemStyle: {
                areaColor: "#7ec8e3",
              },
            },
          },
          series: [
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              data: scatterData,
              symbolSize: (val: number[]) => {
                const count = val[2] || 1;
                return Math.min(Math.max(Math.sqrt(count) * 8, 10), 40);
              },
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
                scale: 3,
              },
              itemStyle: {
                color: (params: {
                  data?: {
                    station?: ChargingStation;
                    carCount?: number;
                    ebikeCount?: number;
                  };
                }) => {
                  const data = params.data;
                  if (data?.station) {
                    // 单个站点：按类型着色
                    return data.station.type === "car" ? "#3b82f6" : "#22c55e";
                  }
                  // 聚合点：混合色（紫色表示混合）
                  const carCount = data?.carCount || 0;
                  const ebikeCount = data?.ebikeCount || 0;
                  if (carCount > 0 && ebikeCount > 0) {
                    return "#8b5cf6"; // 紫色 - 混合
                  } else if (carCount > 0) {
                    return "#3b82f6"; // 蓝色 - 仅汽车
                  } else if (ebikeCount > 0) {
                    return "#22c55e"; // 绿色 - 仅电瓶车
                  }
                  return "#ef4444";
                },
                shadowBlur: 10,
                shadowColor: "rgba(0,0,0,0.3)",
              },
              label: {
                show: currentMap.level < MAX_DRILL_LEVEL,
                formatter: (params: {
                  data?: { carCount?: number; ebikeCount?: number };
                }) => {
                  const data = params.data;
                  if (!data) return "";
                  const carCount = data.carCount || 0;
                  const ebikeCount = data.ebikeCount || 0;
                  // 显示类型图标和数量
                  const parts: string[] = [];
                  if (carCount > 0) parts.push(`🚗${carCount}`);
                  if (ebikeCount > 0) parts.push(`🛵${ebikeCount}`);
                  return parts.join(" ");
                },
                position: "inside",
                fontSize: 10,
                color: "#fff",
              },
            },
          ],
        };

        chart.setOption(option, true);

        // 点击事件
        chart.off("click");
        chart.on("click", (params) => {
          const { componentType, name, data } = params as {
            componentType: string;
            name?: string;
            data?: { station?: ChargingStation; adcode?: string } | null;
          };
          if (componentType === "geo") {
            // 点击地图区域，下钻
            handleDrillDown(name);
          } else if (componentType === "series") {
            // 点击散点
            if (data?.station && onStationClick) {
              onStationClick(data.station);
            } else if (currentMap.level < MAX_DRILL_LEVEL && name) {
              // 聚合点点击，下钻
              handleDrillDown(name, data?.adcode);
            }
          }
        });

        // 响应窗口大小变化
        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);

        setLoading(false);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (error) {
        console.error("Failed to load map:", error);
        setLoading(false);
      }
    };

    initChart();

    return () => {
      isMounted = false;
    };
  }, [isClient, currentMap, stations, aggregateStations, onStationClick]);

  // 下钻处理
  const handleDrillDown = (regionName?: string, directAdcode?: string) => {
    if (!regionName || currentMap.level >= MAX_DRILL_LEVEL) return;

    // 优先使用直接传入的 adcode
    let adcode = directAdcode;

    // 否则从 features 中查找
    if (!adcode) {
      const feature = geoFeatures.find((f) => f.properties.name === regionName);
      if (feature) {
        adcode = getAdcodeFromFeature(feature);
      }
    }

    // 最后尝试从映射获取
    if (!adcode) {
      adcode = getAdcodeByName(regionName);
    }

    if (adcode) {
      setMapStack((prev) => [
        ...prev,
        {
          level: prev[prev.length - 1].level + 1,
          name: regionName,
          adcode,
        },
      ]);
    }
  };

  // 返回上级
  const handleBack = () => {
    if (mapStack.length > 1) {
      setMapStack((prev) => prev.slice(0, -1));
    }
  };

  // 获取层级名称
  const getLevelName = (level: number): string => {
    const names = ["全国", "省级", "市级", "区级"];
    return names[level] || "";
  };

  if (!isClient) {
    return (
      <div className={className} style={{ width: "100%", height: "100%" }}>
        <div className="flex items-center justify-center h-full text-slate-400">
          加载地图中...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className || ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* 返回按钮 */}
      {mapStack.length > 1 && (
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-md text-sm font-medium text-slate-700 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>
            返回
            {mapStack[mapStack.length - 2]?.name === "china"
              ? "全国"
              : mapStack[mapStack.length - 2]?.name}
          </span>
        </button>
      )}

      {/* 当前位置面包屑 */}
      <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/90 rounded-lg shadow-md text-sm text-slate-600">
        {mapStack.map((m, i) => (
          <span key={m.adcode}>
            {i > 0 && " > "}
            {m.name === "china" ? "全国" : m.name}
          </span>
        ))}
        <span className="ml-2 text-slate-400 text-xs">
          ({getLevelName(currentMap.level)})
        </span>
      </div>

      {/* 加载提示 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
          <div className="text-slate-500">加载中...</div>
        </div>
      )}

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 z-10 px-4 py-3 bg-white/90 rounded-lg shadow-md text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-600">汽车充电桩</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-slate-600">电瓶车充电桩</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-500"></span>
            <span className="text-slate-600">混合</span>
          </div>
        </div>
      </div>

      {/* 地图容器 */}
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
