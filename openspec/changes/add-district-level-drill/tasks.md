## 1. GeoLoader 扩展
- [x] 1.1 新增 getAdcodeFromFeatures() 函数从 GeoJSON 提取子区域 adcode
- [x] 1.2 缓存动态获取的 adcode 映射

## 2. 地图组件改造
- [x] 2.1 扩展 MapLevel 支持 level 3（区级）
- [x] 2.2 调整 aggregateStations() 聚合逻辑（level 2 按区聚合）
- [x] 2.3 更新点击事件支持区级下钻
- [x] 2.4 更新面包屑导航显示 4 级

## 3. 数据与测试
- [x] 3.1 更新示例数据添加区级地址信息
- [x] 3.2 验证武汉市下钻到各区功能
