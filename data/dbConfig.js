const dbConfig = {
  name: "winstallPackages",
  version: 2,
  objectStoresMeta: [
    {
      store: "packages",
      storeConfig: { ketPath: "packages", autoIncrement: false },
      storeSchema: [
        { name: "_id", keyPath: "_id", options: { unique: true } },
        { name: "name", keyPath: "name", options: { unique: false } },
        { name: "icon", keyPath: "icon", options: { unique: false } },
        { name: "publisher", keyPath: "publisher", options: { unique: false } },
        { name: "desc", keyPath: "desc", options: { unique: false } },
        { name: "homepage", keyPath: "homepage", options: { unique: false } },
        { name: "latestVersion", keyPath: "latestVersion", options: { unique: false } },
        { name: "versions", keyPath: "versions", options: { unique: false } },
        { name: "tags", keyPath: "tags", options: { unique: false } },
        { name: "moniker", keyPath: "moniker", options: { unique: false } },
        { name: "path", keyPath: "path", options: { unique: false } },
        { name: "license", keyPath: "license", options: { unique: false } },
        { name: "licenseUrl", keyPath: "licenseUrl", options: { unique: false } },
        { name: "minOS", keyPath: "minOS", options: { unique: false } },
        { name: "updatedAt", keyPath: "updatedAt", options: { unique: false } },
      ],
    },
  ],
};


export default dbConfig;