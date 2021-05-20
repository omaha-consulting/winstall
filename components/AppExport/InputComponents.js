import styles from "../../styles/exportApps.module.scss";

export const CheckboxConfig = ({ id, defaultChecked, updateConfig, hiddenOptions, labelText }) => {
    if(hiddenOptions.includes(id)) return null;

    return (
        <label htmlFor={id}>
            <input type="checkbox" id={id} checked={defaultChecked} onChange={(e) => updateConfig(id, e.target.checked)}/>
            <p>{labelText} <code>{id}</code></p>
        </label>
    )
}

export const RadioConfig = ({ id, defaultChecked, options, updateConfig, hiddenOptions, labelText }) => {
    if(hiddenOptions.includes(id)) return null;

    return (
        <label className={styles.radioContainer}>
            <p>{labelText} <code>{id}</code></p>

            <div>
                { options.map((option) => {
                    return (
                        <label key={option.id} htmlFor={option.id}>
                            <input type="radio" id={option.id} name={id} value={option.id} onChange={(e) => updateConfig(id, e.target.value)} checked={defaultChecked === option.id}/>
                            <p>{option.label}</p>
                        </label>
                    )
                })}
            </div>
        </label>
    )
}

export const TextInputConfig = ({ id, defaultValue, updateConfig, hiddenOptions, labelText, inputPlaceholder }) => {
    if(hiddenOptions.includes(id)) return null;

    return (
        <label htmlFor={id} className={styles.text}>
            <p>{labelText} <code>{id}</code></p>
            <input type="text" id={id} value={defaultValue} onChange={(e) => updateConfig(id, e.target.value)} placeholder={inputPlaceholder}/>
        </label>
    )
}