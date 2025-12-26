# Change: 新增区级地图下钻功能

## Why
当前地图仅支持下钻到市级（level 2），无法查看区/县级别的充电桩分布。用户需要更细粒度地查看某个城市内各区的充电桩位置。

## What Changes
- 扩展地图下钻层级：全国 → 省 → 市 → 区（level 0-3）
- 动态获取子区域 adcode（从 GeoJSON features 中提取）
- 区级视图显示所有充电桩散点
- 更新面包屑导航支持 4 级

## Impact
- Affected specs: `china-map`（修改下钻需求）
- Affected code:
  - `app/components/china-map/ChinaMap.tsx` - 扩展下钻逻辑
  - `app/components/china-map/geoLoader.ts` - 动态 adcode 获取

