## Why

winstall-api 的 `GET /packs/:id` 已在快照卡片上补齐 `desc`、`versions`、`updatedAt`、`available`。Web 详情页仍对每个 app 再打 `GET /apps/:id`，多一轮往返，且会把 API 未提供的 like 数塞进卡片。现在应改为只消费补齐后的详情 payload。

## What Changes

- Pack 详情首次加载只使用 `GET /packs/:id` 的 `apps[]`，MUST NOT 再按 id 请求 `GET /apps/:id`。
- Pack 详情与 `/generate` 上共用的 app 卡片 MUST NOT 展示 like 数（不读 `likeCount` / `likes`，也不为 likes 补打目录或 stats）。
- 目录下架用详情里的 `available`（`false` 视为不可用），不再靠 app 详情 404/410 推断。
- 在详情页完成加 app、删 app、改版本、改 installOptions、改 pack 元数据且写入成功后，再请求一次 `GET /packs/:id` 刷新列表。成功路径 MUST NOT 把写回包里的薄 `apps[]` 当成卡片权威。仅当这次详情 GET 失败时，才把写回包 `apps[]` **merge** 进当前本地列表作降级（已有卡保留 `desc`/`versions`/`available`；新加的卡可能暂时没有这些字段）。仅更改默认安装选项成功后 MUST NOT 重拉详情，也 MUST NOT 用写回包替换 `apps[]`。
- Copy pack、删除整个 pack 不在此刷新范围内（copy 不改当前详情卡片数据；删除后离开页面）。
- `/generate` 仍走选中列表与 `ensureAppBasics` / `ensureAppsWithVersions` 拉目录字段；本 change 只去掉该页卡片上的 like 展示。
- 不改 winstall-api；不给货架 / Pack 列表补 hydrate。

## Capabilities

### New Capabilities

- （无）

### Modified Capabilities

- `pack-api-client`：Pack 详情必须直接消费 `GET /packs/:id` 补齐后的 `apps[]`；写成功后重拉该详情；`PackDetailAppCard`（详情与 generate）不展示 like。

## Impact

- **Web**：`pages/packs/[id].js` 去掉 `enrichApps`；读写后刷新走 `fetchPackById`；`components/PackDetailAppCard.js` 去掉 like 行并认 `available`；`utils/packHelpers.js` 的 merge/unavailable 推断按新形状收敛。
- **表面**：Pack 详情 `/packs/:id`，以及 `/generate` 上同款卡片的 like 展示。列表、trending、app 详情页不变。
- **API**：依赖已部署的详情 hydrate；写接口仍回快照，Web 不以写回包为卡片权威。
- **规范**：更新 `pack-api-client` 对详情 `apps[]` 与卡片 like 展示的约定。
