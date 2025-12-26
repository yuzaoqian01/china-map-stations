# Change: 添加中国地图及 Markers 功能

## Why

项目需要一个交互式的中国地图组件，用于展示地理位置数据并支持自定义标记点（markers）。

## What Changes

- 添加基于 Highcharts 的中国地图渲染组件
- 实现 markers 功能，支持在地图上添加自定义标记点
- 支持 marker 的点击交互和 tooltip 展示
- 提供 markers 数据的动态配置能力

## Impact

- Affected specs: `china-map`（新增）
- Affected code:
  - `app/components/china-map/` - 新增地图组件
  - `app/routes/home.tsx` - 集成地图展示
