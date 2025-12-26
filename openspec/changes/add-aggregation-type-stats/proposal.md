# Change: 聚合点展示充电桩类型数量统计

## Why

当前聚合点只显示总数量，无法区分汽车充电桩和电瓶车充电桩的数量。用户需要在聚合视图中快速了解各类型充电桩的分布情况。

## What Changes

- 聚合数据增加按类型统计（carCount, ebikeCount）
- Tooltip 展示类型数量明细
- 聚合点标签显示类型数量（如 "🚗5 🛵3"）

## Impact

- Affected specs: `china-map`（修改聚合需求）
- Affected code:
  - `app/components/china-map/ChinaMap.tsx` - 聚合逻辑和展示
