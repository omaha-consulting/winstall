import styles from "../styles/singleApp.module.scss";

const AppIcon = ({name, icon}) => {
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
    
    return (
        <img
            src={
                icon.startsWith("http")
                ? icon
                : `https://api.winstall.app/icons/${icon}`
            }
            draggable={false}
            alt={`Logo for ${name}`}
        />
    )
}

export default AppIcon;