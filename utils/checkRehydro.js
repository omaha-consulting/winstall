// function for checking if rehydro is needed
let checkRehydation = new Promise((resolve) => {
    let timeNow = new Date();
    let lastRehydrate = localStorage.getItem("winstallRehydro");

    if (lastRehydrate) {
        lastRehydrate = new Date(lastRehydrate);
        let timeDiffernece = Math.abs(lastRehydrate - timeNow) / 36e5;

        if (timeDiffernece >= 0.5) {
            localStorage.setItem("winstallRehydro", timeNow);
            resolve(true);
        } else {
            resolve(false);
        }
    } else {
        localStorage.setItem("winstallRehydro", timeNow);
        resolve(true);
    }
});

export default checkRehydation;