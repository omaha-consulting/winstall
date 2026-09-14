## Context

约束见仓库根目录 `AGENTS.md` 与 `openspec/config.yaml`。动机见 `proposal.md`。行为见 `specs/pack-api-client/spec.md`。

Pack 详情 `pages/packs/[id].js` 现先 `fetchPackById`（`GET /packs/:id`），再 `enrichApps` 对每个 id 打 `GET /apps/:id`。卡片 `PackDetailAppCard` 认 `unavailable`、`likeCount`、`selectedVersion`。写路径（加/删 app、防抖 persist 版本与 installOptions、编辑 pack）用 `updatePack` 回包，再 `mergeAppsWithEnrichedData` 或再次 `enrichApps`。winstall-api 仅在 `GET /packs/:id` 上 hydrate；`PATCH` / `POST` / `copy` 仍为快照卡片（无 `desc` / `versions` / `available`）。详情 `latestVersion` 是快照钉住的 `appVersion`，不是目录最新版。

## Goals / Non-Goals

**Goals:**

- 详情读写都以 `GET /packs/:id` 的补齐 `apps[]` 为卡片权威。
- 用 `available === false` 替代 404 推断下架。
- 写入成功后只多一次详情 GET，不再 N 次 app 详情。

**Non-Goals:**

- 不改 winstall-api，不给写回包做 hydrate。
- 不改 `/generate` 的 `ensureAppBasics` / `ensureAppsWithVersions` 拉目录方式（只去掉 like 展示）。
- 不在 Pack 详情 / generate 的 app 卡上补货架终身 `viewCount` / `downloadCount` / `likeCount`。
- 不把列表 / trending 的薄 `apps[]` 改成详情形状。

## Decisions

### 1. 去掉 `enrichApps`，详情只信 `GET /packs/:id`

**选择：** 删除详情页的 `enrichApps` 及对 `fetchWinstallAPI('/apps/:id')` 的依赖。加载与刷新共用同一套规范化：`transformPackIcons`，把 `available === false` 映成卡片用的 `unavailable`，把展示选中版落到 `selectedVersion`（取元素 `latestVersion`）。

**理由：** API 已补卡片所需目录字段；继续拉 app 详情只会带回 like 等未约定字段。

**备选：** 仅访客跳过 enrich、主人仍拉 `versions` — 否决，详情已含 `versions`。

### 2. 写成功后再 `fetchPackById`，不以 PATCH `apps` 为卡片权威

**选择：** `persistPackApps`、加 app、删 app、编辑 pack 元数据在写入成功后调用与首次加载相同的详情 GET，用结果 `setPack` / `setApps`。乐观更新（下拉改版本、本地删卡）可保留到 GET 返回。成功路径 MUST NOT 把写回包的薄 `apps[]` 设进卡片。防抖路径只在 persist **成功**后拉一次，不在每次 `onChange` 拉。Copy 与删除整个 pack 不拉当前详情。仅更改默认安装选项成功后不重拉、不替换 `apps[]`，只保留本地 filters / `defaultInstallOptions`（见 Decision 5）。详情 GET 失败时的降级见 Decision 6。

**理由：** 写回包是快照，新加的 app 没有 `versions`/`desc`/`available`；merge 救不了新卡。一次 `GET /packs/:id` 比 N 次 app 详情便宜，形状与首次加载相同。

**备选：** 继续 merge 富字段 — 否决，加 app 仍缺目录字段。写接口也 hydrate — 否决，属 API 仓且已明确非目标。

### 3. `PackDetailAppCard` 永久去掉 like 行

**选择：** 从 `PackDetailAppCard` 删除 like 展示（含 `likeCount` / `likes` 读取与图标行）。Pack 详情与 `/generate` 共用该组件，两处都不再显示 like。详情规范化也不写入这些字段。

**理由：** 产品决定 generate 也不显示 like；组件级删除比靠字段缺省更干净，避免选中列表里残留 like 又露出来。

**备选：** 仅详情规范化去掉字段、generate 仍显示 — 否决。加 `showLikes` prop 默认 false — 过度设计，当前无调用方要显示。

### 4. 下架映射留在详情规范化，不强迫改存储快照 helper

**选择：** `isAppUnavailable`（按 HTTP 404/410）随 `enrichApps` 不再被详情使用。卡片继续认 `unavailable`；规范化时 `unavailable: app.available === false`。`toAppSnapshot` / `formatAppsForPatch` 仍提交 `appId` / `appName` / `appVersion`。

**理由：** 列表与写入仍是快照形状；只在详情读路径认 `available`。

### 5. 默认安装选项写入成功后不重拉详情

**选择：** `persistPackDefaultOptions` 成功后 MUST NOT 再 `GET /packs/:id`，MUST NOT 用 PATCH 回包的 `apps[]` 覆盖卡片。只更新本地 `defaultInstallOptions` / filters。

**理由：** 这次 PATCH 不改 `apps[]`；重拉没有新的卡片信息，还可能冲掉用户刚选的 filters。现有代码已刻意保留本地 filters。

**备选：** 与其它 edit 一样重拉 — 否决。重拉但强留 filters — 否决，多一次 GET 还要特殊合并。

### 6. 详情 GET 失败时 merge 薄写回包，不整表替换

**选择：** 加/删/改版本/`installOptions`/pack 元数据在 PATCH 成功且随后 `GET /packs/:id` 失败时，把写回包 `apps[]` **merge** 进当前本地列表（保留已有 `desc`、`versions`、`unavailable`/`available` 等富字段；新 id 才用薄快照）。toast 提示刷新失败。MUST NOT 用薄 `apps[]` 整表替换。用户刷新页面即可回到 hydrate 后的详情。

**理由：** PATCH 成功 + GET 失败极少见，可以接受新卡暂时缺简介和版本下拉；但不能让一次读失败把整页已有卡冲成快照。整表替换（裸 C）否决。只留乐观 UI 不应用 PATCH（A）在「加 app 且 GET 失败」时可能仍显示旧列表，用户以为没加上。

**备选：** A 纯乐观、不碰 PATCH — 加 app 失败观感更差。B 回滚 — 否决，写入已成功。自动重试 GET（D）— 不做，极端路径不值得。

## Risks / Trade-offs

- **[Risk] 写入成功但随后 `GET /packs/:id` 失败。** 缓解：Decision 6，merge 降级；新卡可能暂无 `desc`/`versions`，接受。
- **[Risk] 防抖 persist 与慢 GET 乱序。** 缓解：以最后一次成功的详情 GET 为准（忽略过期响应），不要并行叠多层 merge。
- **[Risk] 未部署 hydrate 的 API 会让卡片缺 `desc`/`versions`。** 缓解：本 change 假定详情 hydrate 已上线；缺字段时卡片降级（无简介、无版本下拉），但不再回退 N+1。
- **[Trade-off] 每次写多一次 GET。** 接受；对比原来的 N×`GET /apps/:id` 仍更少。

## Migration Plan

- 只发 Web。回滚：恢复 `enrichApps`、写后 merge、以及卡片 like 行。
- 不迁数据、不改 API。

## Open Questions

无。
