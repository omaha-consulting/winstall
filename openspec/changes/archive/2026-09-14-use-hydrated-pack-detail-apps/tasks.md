## 1. 详情读路径与卡片 like

- [x] 1.1 在 `utils/packHelpers.js` 或 `pages/packs/[id].js` 抽出详情 `apps[]` 规范化（`transformPackIcons`、`available === false` → `unavailable`、`selectedVersion` 取 `latestVersion`），且不写入 `likeCount` / `likes`
- [x] 1.2 改 `pages/packs/[id].js` 的 `loadPack`：`GET /packs/:id` 成功后只走该规范化并 `setPack` / `setApps`；删除 `enrichApps` 及对 `fetchWinstallAPI('/apps/:id')` 的调用
- [x] 1.3 从 `components/PackDetailAppCard.js` 删除 like 展示（详情与 `/generate` 共用）。**Verify:** 打开详情无 N 次 `GET /apps/:id`；`available: false` 的卡显示 Unavailable；详情与 generate 卡均无 like

## 2. 写入后重拉

- [x] 2.1 抽出写成功后的刷新：再 `fetchPackById`，成功则用规范化结果覆盖 pack/apps；GET 失败则把写回包 `apps[]` merge 进当前列表并 toast，MUST NOT 整表替换
- [x] 2.2 `persistPackApps`（版本与 installOptions 防抖成功后）、`handleAppsAdded`、`handleDeleteApp`、`handlePackUpdated` 成功后走 2.1；这些路径的成功 GET 不再 `enrichApps`、不再把 PATCH `apps` 当权威
- [x] 2.3 `persistPackDefaultOptions` 成功后不 `fetchPackById`、不替换 `apps[]`，只保留本地 filters。Copy pack 与删除整个 pack 不重拉当前详情。**Verify:** 加/删/改版本或元数据后网络里是 `PATCH` 再一次 `GET /packs/:id`，没有 `GET /apps/:id`；只改默认安装选项没有详情 GET；写入失败没有额外详情 GET

## 3. 清理

- [x] 3.1 保留 `mergeAppsWithEnrichedData` 供详情 GET 失败时的降级；若 `isAppUnavailable` 已无调用方则删除；不改列表行为
- [x] 3.2 `/generate` 仍用 `ensureAppBasics` / `ensureAppsWithVersions` 拉目录字段；本 change 只去掉 like 展示，不改其请求
