const dbConfig = {
  name: "winstallPackages",
  version: 1,
  objectStoresMeta: [
    {
      store: "packages",
      storeConfig: { ketPath: "packages", autoIncrement: false },
      storeSchema: [
        { name: "name", keyPath: "name", options: { unique: false } },
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "publisher", keyPath: "publisher", options: { unique: false } },
        { name: "path", keyPath: "path", options: { unique: false } },
        { name: "yamlStore", keyPath: "yamlStore", options: { unique: false } },
        { name: "contents", keyPath: "contents", options: { unique: false } },
      ],
    },
  ],
};


export default dbConfig;