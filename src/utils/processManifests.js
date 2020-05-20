import YAML from "yamljs";

function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}


const processManifests = (app) => {
    console.log("Requesting manifest...", app.path)
    return new Promise((resolve) => {
        fetch(app.yamlStore)
          .then((res) => res.json())
          .then((data) => {
            let manifestContents = b64DecodeUnicode(data.content);
            let parsedManifest = YAML.parse(manifestContents);
            resolve(parsedManifest);
          }).catch(err => console.log(err));
    });
};

export default processManifests;