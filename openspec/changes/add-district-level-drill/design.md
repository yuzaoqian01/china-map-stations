## Context
当前地图下钻最多到市级（level 2），市级视图直接显示所有充电桩散点。用户需要进一步下钻到区/县级别查看更精确的分布。

## Goals / Non-Goals
- Goals:
  - 支持 4 级下钻：全国 → 省 → 市 → 区
  - 区级视图显示该区内所有充电桩
  - 动态从 GeoJSON 获取子区域 adcode
- Non-Goals:
  - 不支持街道/乡镇级别（GeoJSON 数据不支持）
  - 不改变充电桩数据结构

## Decisions

### adcode 获取策略
当前仅有省级 adcode 硬编码映射，市/区级 adcode 需要动态获取。

**方案**: 从 GeoJSON features 中提取 adcode
```typescript
// GeoJSON feature 结构
{
  properties: {
    name: "武昌区",
    adcode: 420106,  // 可直接使用
    center: [114.31, 30.55]
  }
}
```

### 层级定义
| Level | 名称 | 示例 | 下钻行为 |
|-------|------|------|----------|
| 0 | 全国 | china | 点击省份 → level 1 |
| 1 | 省级 | 湖北省 | 点击城市 → level 2 |
| 2 | 市级 | 武汉市 | 点击区县 → level 3 |
| 3 | 区级 | 武昌区 | 显示所有散点，不再下钻 |

### 聚合策略调整
```
level 0-1: 按省/市聚合显示数量
level 2: 按区聚合显示数量
level 3: 显示所有充电桩散点（不聚合）
```

### 代码改动点
1. `geoLoader.ts`:
   - 新增 `getAdcodeFromFeatures()` 从 GeoJSON 提取 adcode
   - 缓存已加载的 adcode 映射

2. `ChinaMap.tsx`:
   - `MapLevel.level` 支持 0-3
   - `aggregateStations()` 调整聚合逻辑
   - 点击事件判断 level < 3 时继续下钻

## Risks / Trade-offs
- 部分偏远区县 GeoJSON 数据可能不完整 → 加载失败时提示用户
- 区级地图较小，散点可能重叠 → 保持当前缩放平移功能

## Open Questions
- 无

