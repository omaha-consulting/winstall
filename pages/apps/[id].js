import styles from "../../styles/home.module.scss";

import SingleApp from "../../components/SingleApp";
import PopularApps from "../../components/PopularApps";
import SelectionBar from "../../components/SelectionBar";

import Footer from "../../components/Footer";
import Error from "../../components/Error";
import { shuffleArray } from "../../utils/helpers";
import popularAppsList from "../../data/popularApps.json";

import { useRouter } from "next/router";

function AppDetail({ app }) {
    const router = useRouter();
    const fallbackMessage = {
        title: "Sorry! We could not load this app.",
        subtitle: "Unfortunately, this app could not be loaded. Either it does not exist, or something else went wrong. Please try again later."
    }
    if(router.isFallback){
        return <Error {...fallbackMessage}/>
    }

    if (!app || !app._id) return <Error {...fallbackMessage}/>;

    return (
        <div className="container">
            <div className={styles.intro}>
                <div className="illu-box">
                    <SingleApp app={app}/>
                    <div className="art">
                        <img
                            src="/assets/logo.svg"
                            draggable={false}
                            alt="winstall logo"
                        />
                    </div>
                </div>
            </div>

            {/* <PopularApps apps={popular} all={apps} /> */}

            <SelectionBar />

            <Footer />
        </div>
    );
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    console.log("Getting content from API")
    let app = await fetch(`https://api.winstall.app/apps/${params.id}`).then((res) =>
        res.json()
    ).catch(err => {
        return {}
    });

    return {
        props: {
            app
        },
        unstable_revalidate: 1
    }
}

export default AppDetail;