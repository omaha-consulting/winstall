import Link from "next/link";
import Head from "next/head";

export default function Explainer() {
  return (
    <div className="container">
      <Head>
        <title>winstall - how does it work?</title>
      </Head>
      <article>
        <section>
          <h2>How does this app work?</h2>
          <p>
            winstall is powered by Windows Package Manager (aka "winget"),{" "}
            <a
              href="https://devblogs.microsoft.com/commandline/windows-package-manager-preview/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft's new package manager
            </a>{" "}
            for Windows 10. Windows Package Manager is currently in preview, and
            it is not available by default in Windows 10.
          </p>
        </section>

        <section>
          <h2>Installing Windows Package Manager</h2>
          <p>
            If you don't already have Windows Package Manager, you can install
            it by downloading and installing the{" "}
            <a
              href="https://github.com/microsoft/winget-cli/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              latest .appxbundle file from here.
            </a>
          </p>
        </section>

        <section>
          <h2>Using winstall</h2>
          <p>
            To use winstall, you can search for apps on the homepage.
            Additionally, you can also view all the apps available via Windows
            Package Manager{" "}
            <Link href="/apps">
              <a>on this page.</a>
            </Link>
          </p>
          <p>
            Simply select the apps you want to download and click on the
            "Generate Script" button at the bottom of the screen. You will then
            be presented with a command that you can copy and paste into any
            Windows command-line. Input that into a command line app of your
            choice, and hit enter to start installing the apps one-by-one using
            Windows Package Manager.
          </p>
          <p>
            Alternatively, you can click on the "Download .bat" button which
            will download a batch file. However, you will likely get a security
            warning from your browser. In that case, ignore the warning as the
            batch file is completely secure. Once downloaded, you can
            double-click the .bat file to install the apps using the Windows
            Package Manager.
          </p>
        </section>

        <section>
          <h2>How is the data obtained?</h2>
          <p>
            When you first load this website, winstall will automatically fetch
            the latest data from the{" "}
            <a
              href="https://github.com/microsoft/winget-pkgs"
              target="_blank"
              rel="noopener noreferrer"
            >
              official repository
            </a>{" "}
            for Windows Package Manager apps. The latest data is then cached
            locally on your device. The app only obtains the list of packages
            available, in order to avoid hitting the{" "}
            <a
              href="https://developer.github.com/v3/#rate-limiting"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub API limit
            </a>{" "}
            quickly.
          </p>
          <p>
            When you search for an app, winstall will only fetch the details for
            that app and update the local cache. This way, when you first search
            for an app, it may take a few seconds to load, but the subsequent
            searches will be instant.
          </p>
          <p>
            On{" "}
            <Link href="/apps">
              <a>the "all apps" page</a>
            </Link>{" "}
            you will be able to see all the currently available apps that are on
            the Windows Package Manager. The data for all the apps will not be
            available at once, and you will have to click on individual apps to
            view their full details. This is, once again, done to avoid hitting
            GitHub API limits.
          </p>
          <p>
            The latest app data is cached for 5 hours, and you can manually
            clear the cache from the "all apps" page if you would like. You may
            sometimes hit the GitHub API limit, in that case some app details
            may not load. You will have to wait an hour before the limit is
            reset by GitHub. I am working on improving the API usage in order to
            limit API requests as much as possible.-
          </p>
        </section>

        <section>
          <h2>Contributing and reporting bugs</h2>
          <p>
            winstall is completely open-source, and you can{" "}
            <a
              href="https://github.com/MehediH/winstall"
              target="_blank"
              rel="noopener noreferrer"
            >
              find the source code here.
            </a>{" "}
            This is only a preview for now, and the code is not very clean -- so
            you are very much welcome to contribute to the project!
          </p>

          <p>
            If you run into any issues, please report it{" "}
            <a
              href="https://github.com/MehediH/winstall/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              using GitHub Issues here.
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
