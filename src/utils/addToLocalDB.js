function compareVersion(v1, v2) {
  if (typeof v1 !== "string") return false;
  if (typeof v2 !== "string") return false;
  v1 = v1.split(".");
  v2 = v2.split(".");
  const k = Math.min(v1.length, v2.length);
  for (let i = 0; i < k; ++i) {
    v1[i] = parseInt(v1[i], 10);
    v2[i] = parseInt(v2[i], 10);
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }
  return v1.length === v2.length ? 0 : v1.length < v2.length ? -1 : 1;
}

const addToLocalDB = (db, dataToAdd) => {
    let hashTable = new Map();

    dataToAdd.map((item) => {
      // we make an unique id for the app by combining the publisher name + app name
      // which is part of the manifest submission on github
      let entryId = item.path.substr(0, item.path.lastIndexOf("/"));
      let subs = item.path.split("/")
      let version = subs[subs.length - 1].toLowerCase().replace(".yaml", "")

      let prevVerison = hashTable.get(entryId);

      let app = {
        id: "",
        name: "",
        publisher: "",
        path: entryId,
        yamlStore: item.url,
        contents: "",
      }; 

      // if we already have an entry for this app on the hashmap
      if (prevVerison){
        // if this item is newer than what we have in the cache
        if (compareVersion(version, prevVerison) === 1) { // this function returns 1 if the first param (version) is newer than the 2nd
          hashTable.set(entryId, version); // update the hashmap
          db.update({ ...app }, entryId); // update the local cache
        }
        
        return item;
      };

      hashTable.set(entryId, version);

      db.add(app, entryId).catch(error => {
        console.log(error)
      })

      return item;
    });
}

export default addToLocalDB;