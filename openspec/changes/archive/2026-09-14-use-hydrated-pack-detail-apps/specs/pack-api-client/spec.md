## ADDED Requirements

### Requirement: Pack 详情直接消费补齐后的 apps

Pack 详情页 MUST 用 `GET /packs/:id` 响应中的 `apps[]` 渲染 app 卡片（含快照字段以及 `desc`、`versions`、`updatedAt`、`available`）。该页 MUST NOT 再为列表中的每个 app 请求 `GET /apps/:id`，MUST NOT 请求 `GET /apps/:id/stats` 或其它目录接口来补卡片。`available` 为 `false` 的元素 MUST 仍留在列表原位，并以不可用状态展示。卡片上的展示版本 MUST 使用该元素的 `latestVersion`（即 Pack 快照钉住的版本）。本要求 MUST NOT 改变 `GET /packs`、`GET /packs/me`、`GET /packs/trending` 的列表消费方式，也 MUST NOT 改变 `/generate` 为选中 app 拉取目录详情的方式。

#### Scenario: 打开详情不再按 app 拉目录
- **WHEN** 用户打开某个 Pack 详情页且 `GET /packs/:id` 成功
- **THEN** 页面用该响应的 `apps[]` 画出卡片，且 MUST NOT 对这些 app 再请求 `GET /apps/:id`

#### Scenario: 下架 app 按 available 展示
- **WHEN** 详情 `apps[]` 中某元素 `available` 为 `false`
- **THEN** 该卡 MUST 仍出现在原位，并以不可用状态展示，且 MUST NOT 因此使整页当作 Pack 不存在

#### Scenario: 详情 app 卡不展示 like
- **WHEN** 用户查看 Pack 详情上的 app 卡片
- **THEN** 该卡 MUST NOT 展示该 app 的 like 数，且客户端 MUST NOT 为该数请求目录或 stats

#### Scenario: generate 上的同款卡也不展示 like
- **WHEN** 用户在 `/generate` 查看选中 app 的卡片
- **THEN** 该卡 MUST NOT 展示 like 数

### Requirement: Pack 详情写入成功后重拉详情

在 Pack 详情页，当加 app、删 app、更改某 app 的钉住版本或 `installOptions`、或更改 pack 名称/描述/可见性的写入成功后，客户端 MUST 再请求一次 `GET /packs/:id`，并用该响应替换页面上的 pack 与 `apps[]`。该次详情 GET 成功时，客户端 MUST NOT 把同一次写入回包中的 `apps[]` 当作卡片权威。若写入已成功但这次 `GET /packs/:id` 失败，客户端 MUST 将写回包的 `apps[]` merge 进当前页面上的 app 列表（保留已有元素上的 `desc`、`versions` 与可用状态；仅新出现的 id 使用写回包快照），MUST NOT 用写回包 `apps[]` 整表替换，并 MUST 提示刷新失败。写入失败时 MUST NOT 用这次失败请求去重拉详情。仅更改默认安装选项且写入成功时，客户端 MUST NOT 再请求 `GET /packs/:id`，MUST NOT 用该次写回包替换 `apps[]`。复制整个 pack、删除整个 pack MUST NOT 适用本刷新（删除成功后离开详情页）。

#### Scenario: 加 app 成功后重拉详情
- **WHEN** 用户在详情页把 app 加入 pack 且 `PATCH /packs/:id` 成功
- **THEN** 客户端 MUST 再请求 `GET /packs/:id` 并按新 `apps[]` 渲染卡片，且 MUST NOT 把 PATCH 回包的 `apps[]` 直接当作卡片数据

#### Scenario: 改版本成功后重拉详情
- **WHEN** 拥有者更改某 app 的钉住版本且写入成功
- **THEN** 客户端 MUST 再请求 `GET /packs/:id` 刷新卡片

#### Scenario: 写入失败不重拉
- **WHEN** 详情页上的 pack 写入失败
- **THEN** 客户端 MUST NOT 仅因这次失败而请求 `GET /packs/:id`

#### Scenario: 仅改默认安装选项不重拉详情
- **WHEN** 拥有者更改默认安装选项且写入成功
- **THEN** 客户端 MUST NOT 因此再请求 `GET /packs/:id`，且 MUST NOT 用写回包替换页面上的 `apps[]`

#### Scenario: 详情 GET 失败时 merge 写回包
- **WHEN** 加 app 的 `PATCH /packs/:id` 已成功，但随后的 `GET /packs/:id` 失败
- **THEN** 客户端 MUST 把 PATCH 回包的 `apps[]` merge 进当前列表（已有卡保留补齐字段），MUST NOT 整表换成薄快照，且 MUST 提示刷新失败
