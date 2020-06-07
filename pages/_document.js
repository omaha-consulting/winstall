import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <body>
          <Main />
          <NextScript />
        </body>
        <a id="gsc" href="#" download="winstall.bat" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap"
          rel="stylesheet"
        ></link>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                <script>
                  window.dataLayer = window.dataLayer || [];
                  function gtag() { dataLayer.push(arguments); }
                  gtag('js', new Date());

                  gtag('config', 'UA-48569869-4');
                </script>
              `,
          }}
        />
      </Html>
    );
  }
}

export default MyDocument;
