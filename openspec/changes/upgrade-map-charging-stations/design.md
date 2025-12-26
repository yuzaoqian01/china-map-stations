## Context

需要展示全国范围的充电桩分布，支持多级地图下钻和大量标记点聚合优化。

## Goals / Non-Goals

- Goals:
  - 支持多级地图下钻（全国 → 省 → 市）
  - 大量 markers 聚合显示（支持上千个点）
  - 充电桩详情弹窗展示
  - 区分汽车/电瓶车充电桩类型
- Non-Goals:
  - 不实现路径规划功能
  - 不实现街道级瓦片地图（ECharts 不支持）

## Decisions

### 技术选型

| 方案              | 优点                           | 缺点             | 结论    |
| ----------------- | ------------------------------ | ---------------- | ------- |
| ECharts + GeoJSON | 国内生态好，性能优秀，支持下钻 | 不支持街道级瓦片 | ✅ 推荐 |
| Leaflet + 瓦片    | 支持街道级                     | 需要额外配置聚合 | 备选    |
| Highcharts Maps   | 已有经验                       | 功能有限         | 不推荐  |

**选择**: ECharts + GeoJSON + echarts-for-react

- 理由：
  - 国内文档完善，社区活跃
  - Canvas 渲染性能好，支持大量点位
  - 原生支持地图下钻（全国 → 省 → 市）
  - 散点图 + effectScatter 实现标记点效果

### 依赖包

```json
{
  "echarts": "^5.5.0",
  "echarts-for-react": "^3.0.2"
}
```

### GeoJSON 数据

- 全国地图：`china.json`
- 省级地图：`province/{name}.json`
- 市级地图：`city/{name}.json`
- 数据源：阿里 DataV GeoJSON（https://datav.aliyun.com/portal/school/atlas/area_selector）

### 组件结构

```
app/components/
├── china-map/
│   ├── index.ts
│   ├── ChinaMap.tsx          # ECharts 地图主组件
│   ├── useMapDrill.ts        # 地图下钻 hook
│   ├── geo/                   # GeoJSON 数据
│   │   ├── china.json
│   │   └── provinces/
│   └── types.ts
└── charging-station/
    ├── index.ts
    ├── StationTooltip.tsx    # 充电桩 tooltip
    └── types.ts
```

### 充电桩数据结构

```typescript
interface ChargingStation {
  id: string;
  name: string; // 名称
  address: string; // 地址
  lat: number; // 纬度
  lon: number; // 经度
  price: number; // 价格（元/度）
  distance?: number; // 距离（米，可选）
  type: "car" | "ebike"; // 类型：汽车/电瓶车
  available: number; // 可用数量
  total: number; // 总数量
  status: "online" | "offline" | "busy"; // 状态
}
```

### 地图层级与聚合策略

```
全国视图 (level 0)
  ├─ 按省聚合，显示省份热力 + 聚合数字
  └─ 点击省份 → 下钻

省级视图 (level 1)
  ├─ 按市聚合，显示城市散点 + 聚合数字
  └─ 点击城市 → 下钻

市级视图 (level 2)
  ├─ 显示所有充电桩散点
  └─ 点击散点 → 显示详情 tooltip
```

### ECharts 配置要点

```typescript
{
  geo: {
    map: 'china',  // 或具体省份名
    roam: true,    // 允许缩放平移
    zoom: 1.2,
  },
  series: [
    {
      type: 'effectScatter',  // 涟漪效果散点
      coordinateSystem: 'geo',
      data: markers,
      symbolSize: (val) => Math.sqrt(val[2]) * 2,  // 按数量调整大小
    }
  ]
}
```

## Risks / Trade-offs

- ECharts 不支持真正的街道级瓦片地图 → 市级是最细粒度
- GeoJSON 文件较大 → 按需加载，使用 CDN 缓存
- 上千点位可能卡顿 → 使用 canvas 渲染 + 聚合优化

## Open Questions

- 是否需要用户定位功能计算距离？
- 是否需要筛选功能（按类型、状态筛选）？
