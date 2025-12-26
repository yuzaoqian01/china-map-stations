import type { Route } from "./+types/home";
import { ChinaMap, type ChargingStation } from "../components/china-map";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "充电桩分布图 - ECharts 地图" },
    { name: "description", content: "基于 ECharts 的全国充电桩分布展示" },
  ];
}

// 示例充电桩数据（包含武汉多点位）
const sampleStations: ChargingStation[] = [
  // 武汉充电桩（密集）
  {
    id: "wh-001",
    name: "光谷软件园充电站",
    address: "湖北省武汉市东湖新技术开发区",
    lat: 30.5052,
    lon: 114.4285,
    price: 1.2,
    type: "car",
    available: 8,
    total: 12,
    status: "online",
  },
  {
    id: "wh-002",
    name: "武汉天地充电站",
    address: "湖北省武汉市江岸区",
    lat: 30.6182,
    lon: 114.3055,
    price: 1.5,
    type: "car",
    available: 3,
    total: 8,
    status: "online",
  },
  {
    id: "wh-003",
    name: "楚河汉街充电站",
    address: "湖北省武汉市武昌区",
    lat: 30.5578,
    lon: 114.3695,
    price: 1.3,
    type: "car",
    available: 0,
    total: 6,
    status: "busy",
  },
  {
    id: "wh-004",
    name: "汉口火车站充电站",
    address: "湖北省武汉市江汉区",
    lat: 30.6147,
    lon: 114.2596,
    price: 1.4,
    type: "car",
    available: 5,
    total: 10,
    status: "online",
  },
  {
    id: "wh-005",
    name: "武昌火车站充电站",
    address: "湖北省武汉市武昌区",
    lat: 30.5283,
    lon: 114.3168,
    price: 1.2,
    type: "car",
    available: 2,
    total: 8,
    status: "online",
  },
  {
    id: "wh-006",
    name: "光谷广场电瓶车站",
    address: "湖北省武汉市洪山区",
    lat: 30.5075,
    lon: 114.3995,
    price: 0.5,
    type: "ebike",
    available: 15,
    total: 20,
    status: "online",
  },
  {
    id: "wh-007",
    name: "江汉路电瓶车站",
    address: "湖北省武汉市江汉区",
    lat: 30.5812,
    lon: 114.2855,
    price: 0.4,
    type: "ebike",
    available: 8,
    total: 15,
    status: "online",
  },
  {
    id: "wh-008",
    name: "武汉大学充电站",
    address: "湖北省武汉市武昌区",
    lat: 30.5365,
    lon: 114.3625,
    price: 1.0,
    type: "car",
    available: 4,
    total: 6,
    status: "online",
  },
  {
    id: "wh-009",
    name: "华中科技大学充电站",
    address: "湖北省武汉市洪山区",
    lat: 30.5135,
    lon: 114.4185,
    price: 1.0,
    type: "car",
    available: 6,
    total: 8,
    status: "online",
  },
  {
    id: "wh-010",
    name: "武汉站充电站",
    address: "湖北省武汉市洪山区",
    lat: 30.6095,
    lon: 114.4235,
    price: 1.5,
    type: "car",
    available: 10,
    total: 15,
    status: "online",
  },

  // 北京
  {
    id: "bj-001",
    name: "国贸CBD充电站",
    address: "北京市朝阳区",
    lat: 39.9087,
    lon: 116.4605,
    price: 1.8,
    type: "car",
    available: 12,
    total: 20,
    status: "online",
  },
  {
    id: "bj-002",
    name: "中关村充电站",
    address: "北京市海淀区",
    lat: 39.9837,
    lon: 116.3065,
    price: 1.6,
    type: "car",
    available: 5,
    total: 15,
    status: "online",
  },
  {
    id: "bj-003",
    name: "望京SOHO充电站",
    address: "北京市朝阳区",
    lat: 40.0015,
    lon: 116.4785,
    price: 1.7,
    type: "car",
    available: 3,
    total: 10,
    status: "busy",
  },
  {
    id: "bj-004",
    name: "王府井电瓶车站",
    address: "北京市东城区",
    lat: 39.9145,
    lon: 116.4135,
    price: 0.6,
    type: "ebike",
    available: 20,
    total: 30,
    status: "online",
  },

  // 上海
  {
    id: "sh-001",
    name: "陆家嘴充电站",
    address: "上海市浦东新区",
    lat: 31.2365,
    lon: 121.5015,
    price: 2.0,
    type: "car",
    available: 8,
    total: 16,
    status: "online",
  },
  {
    id: "sh-002",
    name: "徐家汇充电站",
    address: "上海市徐汇区",
    lat: 31.1955,
    lon: 121.4365,
    price: 1.8,
    type: "car",
    available: 4,
    total: 12,
    status: "online",
  },
  {
    id: "sh-003",
    name: "虹桥机场充电站",
    address: "上海市闵行区",
    lat: 31.1975,
    lon: 121.3355,
    price: 2.2,
    type: "car",
    available: 15,
    total: 25,
    status: "online",
  },
  {
    id: "sh-004",
    name: "南京路电瓶车站",
    address: "上海市黄浦区",
    lat: 31.2355,
    lon: 121.4745,
    price: 0.5,
    type: "ebike",
    available: 12,
    total: 18,
    status: "online",
  },

  // 广州
  {
    id: "gz-001",
    name: "天河城充电站",
    address: "广东省广州市天河区",
    lat: 23.1385,
    lon: 113.3285,
    price: 1.5,
    type: "car",
    available: 6,
    total: 10,
    status: "online",
  },
  {
    id: "gz-002",
    name: "珠江新城充电站",
    address: "广东省广州市天河区",
    lat: 23.1195,
    lon: 113.3215,
    price: 1.6,
    type: "car",
    available: 8,
    total: 14,
    status: "online",
  },
  {
    id: "gz-003",
    name: "北京路电瓶车站",
    address: "广东省广州市越秀区",
    lat: 23.1275,
    lon: 113.2655,
    price: 0.4,
    type: "ebike",
    available: 10,
    total: 15,
    status: "online",
  },

  // 深圳
  {
    id: "sz-001",
    name: "福田CBD充电站",
    address: "广东省深圳市福田区",
    lat: 22.5365,
    lon: 114.0555,
    price: 1.8,
    type: "car",
    available: 10,
    total: 18,
    status: "online",
  },
  {
    id: "sz-002",
    name: "南山科技园充电站",
    address: "广东省深圳市南山区",
    lat: 22.5435,
    lon: 113.9555,
    price: 1.6,
    type: "car",
    available: 5,
    total: 12,
    status: "online",
  },
  {
    id: "sz-003",
    name: "华强北电瓶车站",
    address: "广东省深圳市福田区",
    lat: 22.5465,
    lon: 114.0855,
    price: 0.5,
    type: "ebike",
    available: 18,
    total: 25,
    status: "online",
  },

  // 成都
  {
    id: "cd-001",
    name: "春熙路充电站",
    address: "四川省成都市锦江区",
    lat: 30.6575,
    lon: 104.0815,
    price: 1.3,
    type: "car",
    available: 4,
    total: 8,
    status: "online",
  },
  {
    id: "cd-002",
    name: "天府广场充电站",
    address: "四川省成都市青羊区",
    lat: 30.6595,
    lon: 104.0635,
    price: 1.2,
    type: "car",
    available: 6,
    total: 10,
    status: "online",
  },

  // 杭州
  {
    id: "hz-001",
    name: "西湖文化广场充电站",
    address: "浙江省杭州市下城区",
    lat: 30.2805,
    lon: 120.1695,
    price: 1.4,
    type: "car",
    available: 7,
    total: 12,
    status: "online",
  },
  {
    id: "hz-002",
    name: "钱江新城充电站",
    address: "浙江省杭州市江干区",
    lat: 30.2365,
    lon: 120.2185,
    price: 1.5,
    type: "car",
    available: 9,
    total: 15,
    status: "online",
  },

  // 南京
  {
    id: "nj-001",
    name: "新街口充电站",
    address: "江苏省南京市玄武区",
    lat: 32.0445,
    lon: 118.7875,
    price: 1.3,
    type: "car",
    available: 5,
    total: 10,
    status: "online",
  },

  // 重庆
  {
    id: "cq-001",
    name: "解放碑充电站",
    address: "重庆市渝中区",
    lat: 29.5585,
    lon: 106.5775,
    price: 1.2,
    type: "car",
    available: 8,
    total: 12,
    status: "online",
  },

  // 西安
  {
    id: "xa-001",
    name: "钟楼充电站",
    address: "陕西省西安市碑林区",
    lat: 34.2605,
    lon: 108.9435,
    price: 1.1,
    type: "car",
    available: 6,
    total: 10,
    status: "online",
  },
];

export default function Home() {
  const handleStationClick = (station: ChargingStation) => {
    const typeText = station.type === "car" ? "汽车充电桩" : "电瓶车充电桩";
    const statusText =
      station.status === "online"
        ? "在线"
        : station.status === "busy"
        ? "繁忙"
        : "离线";
    alert(
      `${station.name}\n\n` +
        `📍 地址: ${station.address}\n` +
        `💰 价格: ${station.price} 元/度\n` +
        `🔌 可用: ${station.available}/${station.total}\n` +
        `📱 类型: ${typeText}\n` +
        `🔘 状态: ${statusText}`
    );
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* 标题 - 覆盖在地图上方 */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-white/90 mb-1 tracking-tight drop-shadow-lg">
          全国充电桩分布图
        </h1>
        <p className="text-slate-300/70 text-xs md:text-sm drop-shadow">
          点击省份/城市下钻 · 点击散点查看详情
        </p>
      </header>

      {/* 全屏地图 */}
      <ChinaMap
        stations={sampleStations}
        onStationClick={handleStationClick}
        className="w-full h-full"
      />

      {/* 底部信息 */}
      <footer className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-slate-400/60 text-xs">
        基于 ECharts + GeoJSON
      </footer>
    </main>
  );
}
