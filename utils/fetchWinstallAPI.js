const fetchWinstallAPI = async (path, givenOptions) => {
  const url = `${process.env.NEXT_PUBLIC_WINGET_API_BASE}${path}`;

  let additionalOptions = { ...givenOptions };
  let headerOptions;

  if (additionalOptions) {
    headerOptions = { ...givenOptions?.headers };
    delete additionalOptions["headers"];
  }

  let response, error;

  try {
    const res = await fetch(url, {
      headers: {
        AuthKey: process.env.NEXT_PUBLIC_WINGET_API_KEY,
        AuthSecret: process.env.NEXT_PUBLIC_WINGET_API_SECRET,
        ...headerOptions,
      },
      ...additionalOptions,
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error((await res.json()).error);
      error = (await res.json()).error;
    } else {
      response = await res.json();
    }
  } catch (err) {
    error = err.message;
    throw new Error(err);
  }

  return { response, error };
};

module.exports = fetchWinstallAPI;
