import Head from "next/head";

const MetaTags = ({ title, desc="Bulk install Windows apps quickly with Windows Package Manager." }) => {
    return (
      <Head>
        <title>{title}</title>
        <meta
          name="title"
          content={title}
        />
        <meta
          name="description"
          content={desc}
        ></meta>

        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#9b2eff" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://winstall.app/" />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={desc}
        />
        <meta property="og:image" content="https://winstall.app/cover.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://winstall.app/" />
        <meta property="twitter:title" content={title} />
        <meta
          property="twitter:description"
          content={desc}
        />
        <meta
          property="twitter:image"
          content="https://winstall.app/cover.png"
        />

        <link rel="apple-touch-icon" href="https://winstall.app/logo192.png" />
        <link rel="manifest" href="https://winstall.app/manifest.json" />
      </Head>
    );
}

export default MetaTags;