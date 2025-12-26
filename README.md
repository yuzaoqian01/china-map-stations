# 全国充电桩分布地图

基于 ECharts + GeoJSON 的交互式中国地图，支持多级下钻和充电桩聚合展示。

## 功能特性

- 🗺️ **多级地图下钻** - 全国 → 省 → 市 → 区，4 级下钻
- 📍 **充电桩标记** - 支持汽车充电桩和电瓶车充电桩
- 🔢 **智能聚合** - 按区域聚合显示，展示各类型数量
- 💡 **详情展示** - Tooltip 显示充电桩详细信息
- 🎨 **类型区分** - 蓝色(汽车) / 绿色(电瓶车) / 紫色(混合)
- 📱 **响应式布局** - 自适应屏幕尺寸

## 技术栈

- **框架**: React 19 + React Router 7
- **地图**: ECharts 6 + GeoJSON
- **样式**: TailwindCSS 4
- **语言**: TypeScript 5
- **构建**: Vite 7

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
app/
├── components/
│   └── china-map/
│       ├── ChinaMap.tsx      # 地图主组件
│       ├── geoLoader.ts      # GeoJSON 数据加载器
│       ├── types.ts          # 类型定义
│       └── index.ts          # 导出
├── routes/
│   └── home.tsx              # 首页（地图展示）
└── root.tsx                  # 根组件
```

## 数据结构

### 充电桩数据

```typescript
interface ChargingStation {
  id: string;
  name: string;                              // 名称
  address: string;                           // 地址
  lat: number;                               // 纬度
  lon: number;                               // 经度
  price: number;                             // 价格（元/度）
  type: "car" | "ebike";                     // 类型
  available: number;                         // 可用数量
  total: number;                             // 总数量
  status: "online" | "offline" | "busy";     // 状态
}
```

## 地图数据源

- **GeoJSON**: [阿里 DataV](https://datav.aliyun.com/portal/school/atlas/area_selector)
- 支持层级: 全国 / 省 / 市 / 区县

## 使用示例

```tsx
import { ChinaMap, type ChargingStation } from "./components/china-map";

const stations: ChargingStation[] = [
  {
    id: "1",
    name: "光谷软件园充电站",
    address: "湖北省武汉市洪山区",
    lat: 30.5052,
    lon: 114.4285,
    price: 1.2,
    type: "car",
    available: 8,
    total: 12,
    status: "online",
  },
];

function App() {
  return (
    <ChinaMap
      stations={stations}
      onStationClick={(station) => console.log(station)}
    />
  );
}
```

## License

MIT
