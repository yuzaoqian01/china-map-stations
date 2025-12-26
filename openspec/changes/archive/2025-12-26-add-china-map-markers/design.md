## Context
项目需要在 React 应用中展示带有标记点的中国地图。已安装 `highcharts-react-official`，需要配置地图模块。

## Goals / Non-Goals
- Goals:
  - 渲染交互式中国地图（省级行政区划）
  - 支持在任意经纬度添加 markers
  - Markers 支持自定义样式和交互
- Non-Goals:
  - 不实现市级/县级下钻功能
  - 不实现地图编辑功能

## Decisions
- **地图库**: 使用 Highcharts Maps
  - 理由：项目已安装 highcharts-react-official，生态成熟，API 稳定
  - 备选：ECharts（更轻量但 API 风格不同）、Leaflet（需要更多配置）
  
- **地图数据**: 使用 @highcharts/map-collection 中国地图数据
  - 理由：官方维护，与 Highcharts 无缝集成
  
- **组件结构**:
  ```
  app/components/china-map/
  ├── index.ts          # 导出
  ├── ChinaMap.tsx      # 主组件
  └── types.ts          # 类型定义
  ```

## Marker 数据结构
```typescript
interface MapMarker {
  id: string;
  name: string;
  lat: number;      // 纬度
  lon: number;      // 经度
  value?: number;   // 可选数值
  color?: string;   // 可选颜色
}
```

## Risks / Trade-offs
- Highcharts 包体积较大 → 使用动态导入减少首屏加载
- 中国地图数据需网络加载 → 可考虑本地化存储

## Open Questions
- 是否需要支持 markers 聚合（当缩放较小时）？

