# Change: 升级地图组件支持充电桩聚合展示

## Why

当前 Highcharts Maps 仅支持省级地图，无法实现类似高德地图的街道级缩放和大量标记点聚合功能。需要升级为瓦片地图方案以支持充电桩业务场景。

## What Changes

- **BREAKING** 替换 Highcharts Maps 为 Leaflet + 高德瓦片地图
- 实现多级缩放（国家 → 省 → 市 → 区 → 街道）
- 实现 Markers 聚合功能（MarkerCluster）
- 新增充电桩数据模型和详情展示
- 支持汽车充电桩和电瓶车充电桩两种类型

## Impact

- Affected specs: `china-map`（重大修改）
- Affected code:
  - `app/components/china-map/` - 重构地图组件
  - `app/components/charging-station/` - 新增充电桩相关组件
  - `package.json` - 新增 leaflet 相关依赖
