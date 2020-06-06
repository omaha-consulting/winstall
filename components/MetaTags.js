import Head from "next/head";

const MetaTags = () => {
    return (
      <Head>
        <title>winstall - GUI for Windows Package Manager</title>
        <meta
          name="title"
          content="winstall - the Windows Package Manager GUI"
        />
        <meta
          name="description"
          content="Bulk install Windows apps quickly with Windows Package Manager."
        ></meta>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#9b2eff" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://winstall.app/" />
        <meta property="og:title" content="winstall" />
        <meta
          property="og:description"
          content="Bulk install Windows apps quickly with Windows Package Manager."
        />
        <meta property="og:image" content="https://winstall.app/cover.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://winstall.app/" />
        <meta property="twitter:title" content="winstall" />
        <meta
          property="twitter:description"
          content="Bulk install Windows apps quickly with Windows Package Manager."
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