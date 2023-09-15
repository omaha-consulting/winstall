import styles from "../styles/singleApp.module.scss";
import LazyLoad from "react-lazyload";
import popularAppsList from "../data/popularApps.json";

const AppIcon = ({id, name, icon}) => {
    // if the app is listed in popularApps, use the image specified there
    const popularApps = Object.values(popularAppsList).filter((app) => app._id === id);
    if (popularApps.length === 1) {
      return (
        <AppPicture
          name={name}
          srcSetPng={`/assets/apps/fallback/${popularApps[0].img.replace("webp", "png")}`}
          srcSetWebp={`/assets/apps/${popularApps[0].img}`}
        />
      );
    }

    if(!icon){ // if we don't have an icon, we mimmick one with app initials
        const nameParts = name.split(" ");
        let initials = name[0].substr(0, 1).toUpperCase();

        if(nameParts.length > 1){
            let secondChar = nameParts[nameParts.length-1].substr(0, 1).toUpperCase();

            // make sure the second character we are about to add is alphanumerical 
            if(secondChar.match(/^[a-z0-9]+$/i)){
                initials += secondChar;
            }
        }

        // Instead of rendering the generic icons with SVG, it would be easier
        // to use a CSS-styled <span> with the initials. However, Google picks
        // this up as text and displays the page text in search results
        // as "GInstall Git with winget" (instead of "Install Git with
        // winget"). So use SVG:
        return (
          <svg width="25" height="25">
            <defs>
              <linearGradient id="grad" x1="0%" y1="-10%" x2="0%" y2="110%" gradientTransform="rotate(12,.5,.5)">
                <stop offset="0%" style={{stopColor:"#f138a7", stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:"#6e1bdc", stopOpacity:1}} />
              </linearGradient>
            </defs>
            <circle cx="12.5" cy="12.5" r="12.5" fill="url(#grad)" />
            <text x="12.5" y="12.5" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="central">
              {initials}
            </text>
          </svg>
        );
    }

    if (icon.startsWith("http")) {
      return (
        <LazyLoad height={25} offset={300} once>
          { // if icon is not hosted on winstall
            icon.startsWith("http") && (
              <img
                src={icon}
                draggable={false}
                alt={`Logo for ${name}`}
                // Specify the size to avoid Cumulative Layout Shift:
                width="25"
                height="25"
              />
            )
          }
        </LazyLoad>
      );
    }

    icon = icon.replace(".png", "")

    return (
      <AppPicture
        name={name}
        srcSetPng={`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/icons/${icon}.png`}
        srcSetWebp={`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/icons/next/${icon}.webp`}
      />
    );
}

const AppPicture = ({ name, srcSetPng, srcSetWebp }) => {
  return (
    <LazyLoad height={25} offset={300} once>
      <picture>
        <source srcSet={srcSetWebp} type="image/webp" />
        <source srcSet={srcSetPng} type="image/png" />
        <img
          src={srcSetPng}
          alt={`Logo for ${name}`}
          draggable={false}
          // Specify the size to avoid Cumulative Layout Shift:
          width="25"
          height="25"
        />
      </picture>
    </LazyLoad>
  );
}

export default AppIcon;