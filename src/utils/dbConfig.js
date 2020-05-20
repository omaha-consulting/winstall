const dbConfig = {
  name: "winstallPackages",
  version: 1,
  objectStoresMeta: [
    {
      store: "packages",
      storeConfig: { autoIncrement: false },
      storeSchema: [
        { name: "name" },
        { name: "id", options: { unique: true } },
        { name: "publisher",  },
        { name: "path", options: { unique: false } },
        { name: "yamlStore", options: { unique: false } },
        { name: "contents", options: { unique: false } },
      ],
    },
  ],
};


export default dbConfig;