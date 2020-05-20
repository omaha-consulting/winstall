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