let generateScript = (selectedApps) => {
  
  let installs = [];
  let apps = [];

  selectedApps.map((app) => {
    if(app.id === undefined) return;

    apps.push(app.id);
    installs.push(`winget install --id=${app.id}`);
  });

  document.querySelector("#gsc").href = "data:text/plain;base64," + btoa(installs.join(" && "));
  document.querySelector("#gsc").click();

  // console.log(apps.join(","), btoa(apps.join(",")), atob(btoa(apps.join(","))));
};

export default generateScript;
