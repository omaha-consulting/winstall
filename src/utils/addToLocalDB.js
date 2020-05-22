const addToLocalDB = (db, dataToAdd) => {
    let hashTable = new Set();

    dataToAdd.map((item) => {
      // we make an unique id for the app by combining the publisher name + app name
      // which is part of the manifest submission on github
      let entryId = item.path.substr(0, item.path.lastIndexOf("/"));

      if (hashTable.has(entryId)) return item;

      hashTable.add(entryId);

      let app = {
        id: "",
        name: "",
        publisher: "",
        path: entryId,
        yamlStore: item.url,
        contents: "",
      }; 
      
      db.add(app, entryId).catch(error => {
        console.log(error)
      })

      return item;
    });
}

export default addToLocalDB;