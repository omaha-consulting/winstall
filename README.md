# winstall

## A web app for browsing Windows Package Manager apps, and create a batch-installation command using an inutitive interface.  

How does it work?
-----------------------

winstall is powered by Windows Package Manager (aka "winget"), [Microsoft's new package manager](https://devblogs.microsoft.com/commandline/windows-package-manager-preview/) for Windows 10. Windows Package Manager is currently in preview, and it is not available by default in Windows 10.

Installing Windows Package Manager
----------------------------------

If you don't already have Windows Package Manager, you can install it by downloading and installing the [latest .appxbundle file from here.](https://github.com/microsoft/winget-cli/releases)

Using winstall
--------------

To use winstall, you can search for apps on the homepage. Additionally, you can also view all the apps available via Windows Package Manager [on this page.](/store)

Simply select the apps you want to download and click on the "Generate Script" button at the bottom of the screen. You will then be presented with a command that you can copy and paste into any Windows command-line. Input that into a command line app of your choice, and hit enter to start installing the apps one-by-one using Windows Package Manager.

Alternatively, you can click on the "Download .bat" button which will download a batch file. However, you will likely get a security warning from your browser. In that case, ignore the warning as the batch file is completely secure. Once downloaded, you can double-click the .bat file to install the apps using the Windows Package Manager.

How is the data obtained?
-------------------------

When you first load this website, winstall will automatically fetch the latest data from the [official repository](https://github.com/microsoft/winget-pkgs) for Windows Package Manager apps. The latest data is then cached locally (using IndexedDB) on your device. The app only obtains the list of packages available, in order to avoid hitting the [GitHub API limit](https://developer.github.com/v3/#rate-limiting) quickly.

When you search for an app, winstall will only fetch the details for that app and update the local cache. This way, when you first search for an app, it may take a few seconds to load, but the subsequent searches will be instant.

On [the "all apps" page](/store) you will be able to see all the currently available apps that are on the Windows Package Manager. The data for all the apps will not be available at once, and you will have to click on individual apps to view their full details. This is, once again, done to avoid hitting GitHub API limits.

The latest app data is cached for 5 hours, and you can manually clear the cache from the "all apps" page if you would like. You may sometimes hit the GitHub API limit, in that case some app details may not load. You will have to wait an hour before the limit is reset by GitHub. I am working on improving the API usage in order to limit API requests as much as possible.-

Popular apps
------------

The list of popular apps are fetched from a `.json` file with a pre-poulated set of data. On the front-end, a random selection of 6 apps from teh list is displayed. If you would like to add an app to the list of popular apps, you can do so by [adding an app here](https://github.com/MehediH/winstall/blob/master/src/data/popularApps.json) and creating a pull request. You will also have to provide a logo for that app, which needs to have a transparent image, be 150x150px, and in the .webp format. The logo must be [added in this folder.](https://github.com/MehediH/winstall/tree/master/src/assets/apps) 