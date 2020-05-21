export let shuffleArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export let sortArray = (a) => {
  a.sort((a, b) => a.name.localeCompare(b.name))
  return a;
}

export let sanitize = (obj) => {
  if(!obj.contents) return obj;
  
  obj.id = obj.contents.Id;
  obj.name = obj.contents.Name;
  obj.publisher = obj.contents.Publisher;
  obj.version = obj.contents.Version;
  obj.desc = obj.contents.Description;
  obj.homepage = obj.contents.Homepage;

  return obj;
}

export let checkTheme = () => {
  let isLight = false;

  const themeChecker = window.matchMedia('(prefers-color-scheme: light)');

  // if user doesn't have preference, we check their browser theme
  if (!localStorage.getItem("wiTheme")) {
    if (themeChecker.matches) {
      document.body.classList.add("light");
      localStorage.setItem("wiTheme", "light")
      isLight = true;
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("wiTheme", "dark")
      isLight = false;
    }
  } else{
    isLight = localStorage.getItem("wiTheme") === "light" ? true : false;

    if(isLight){
      document.body.classList.add("light");
    } else{
      document.body.classList.add("dark");
    }
  }

  // listen to browser theme changes
  if (window.matchMedia) {
    themeChecker.addListener(() => {
      if (themeChecker.matches) {
        localStorage.setItem("wiTheme", "light")
        document.body.classList.replace("dark", "light");
        isLight = true;
      } else {
        localStorage.setItem("wiTheme", "dark")
        document.body.classList.replace("light", "dark");
        isLight = false
      }
    })
  } 

  return isLight;
}