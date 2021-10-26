# R-App

个人使用的 pc 端应用，内含一些游戏脚本，不商用。

## 应用

技术栈 React + Typescript + Electron
数据持久化没用开源库，自己整了个操作本地 json 文件的 db 方法

```typescript
项目启动

// 依赖安装
yarn

// electron 依赖编译
yarn rebuild

// 启动前端应用
yarn start

// 启动 electron
yarn dev:electron
```

## 功能模块

### 游戏

#### 梦幻西游

- 自动喊话
- 商品管理
- 背包识别/自动上架
