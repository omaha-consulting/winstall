import YAML from "yamljs";

const processManifests = (app) => {
    console.log("Requesting manifest...", app.path)
    return new Promise((resolve) => {
        fetch(app.yamlStore)
          .then((res) => res.json())
          .then((data) => {
            let manifestContents = window.atob(data.content);
            let parsedManifest = YAML.parse(manifestContents);
            resolve(parsedManifest);
          });
    });
};

export default processManifests;