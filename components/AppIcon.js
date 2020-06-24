import styles from "../styles/singleApp.module.scss";
import LazyLoad from "react-lazyload";
import popularAppsList from "../data/popularApps.json";

const AppIcon = ({id, name, icon}) => {
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

        return <span className={styles.noIcon}>{initials}</span>;
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
              />
            )
          }
        </LazyLoad>
      );
    }

    // if the app is listed in popularApps, use the image specified there
    const popularApps = Object.values(popularAppsList).filter((app) => app._id === id);
    if (popularApps.length === 1) {
      return (
        <LazyLoad height={25} offset={300} once>
          <picture>
            <source srcSet={`/assets/apps/${popularApps[0].img}`} type="image/webp" />
            <source srcSet={`/assets/apps/fallback/${popularApps[0].img.replace("webp", "png")}`} type="image/png" />
            <img
              src={`/assets/apps/fallback/${popularApps[0].img.replace("webp", "png")}`}
              alt={`Logo for ${name}`}
              draggable={false}
            />
          </picture>
        </LazyLoad>
      );
    }

    icon = icon.replace(".png", "")

    return (
      <LazyLoad height={25} offset={300} once>
        <picture>
          <source srcSet={`https://api.winstall.app/icons/next/${icon}.webp`} type="image/webp" />
          <source srcSet={`https://api.winstall.app/icons/${icon}.png`} type="image/png" />
          <img
            src={`https://api.winstall.app/icons/${icon}.png`}
            alt={`Logo for ${name}`}
            draggable={false}
          />
        </picture>
      </LazyLoad>
    )
}

export default AppIcon;