const processManifests =  (packageData) => {
    // we only care about the manifest files within the tree
    packageData = packageData.tree.filter((item) => item.path.includes(".yaml"));

    packageData.map((item) => {
         fetch(item.url).then(res => res.json()).then(data => {
            let contents = new Buffer(data.contents, "base64")
            console.log(contents.toString())
         })
    })

    return packageData;
};

export default processManifests;