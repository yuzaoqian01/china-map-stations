## ADDED Requirements

### Requirement: 中国地图渲染
系统 SHALL 提供一个可交互的中国地图组件，展示中国大陆及各省级行政区划边界。

#### Scenario: 地图初始化加载
- **WHEN** 用户访问包含地图的页面
- **THEN** 系统显示完整的中国地图
- **AND** 各省份边界清晰可见

#### Scenario: 地图响应式布局
- **WHEN** 用户调整浏览器窗口大小
- **THEN** 地图组件自适应容器尺寸

### Requirement: Markers 标记点
系统 SHALL 支持在地图上添加自定义标记点（markers），通过经纬度定位。

#### Scenario: 显示 Markers
- **WHEN** 提供 markers 数据数组
- **THEN** 系统在对应经纬度位置显示标记点
- **AND** 标记点样式可配置（颜色、大小）

#### Scenario: Marker Tooltip
- **WHEN** 用户鼠标悬停在 marker 上
- **THEN** 系统显示 tooltip，包含 marker 名称和数值信息

#### Scenario: Marker 点击交互
- **WHEN** 用户点击某个 marker
- **THEN** 系统触发 onClick 回调，传递该 marker 的数据

### Requirement: Markers 数据配置
系统 SHALL 支持通过 props 动态配置 markers 数据。

#### Scenario: 动态更新 Markers
- **WHEN** markers props 数据发生变化
- **THEN** 地图上的标记点同步更新

