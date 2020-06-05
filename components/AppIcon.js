import styles from "../styles/singleApp.module.scss";

const AppIcon = ({name, icon}) => {
    if(!icon){
        const nameParts = name.split(" ");
        let initials = name[0].substr(0, 1).toUpperCase();
        if(nameParts.length > 1) initials += nameParts[nameParts.length-1].substr(0, 1).toUpperCase();

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