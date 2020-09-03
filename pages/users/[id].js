import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import { withRouter } from 'next/router'
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/client";
import Error from "../../components/Error";

function UserProfile({ uid }) {
    const [user, setUser] = useState();
    const [session, loading] = useSession();
    const [title, setTitle] = useState("Loading...");
    const [packs, setPacks] = useState([]);

    useEffect(() => {
        getSession().then(async (session) => {

            await fetch(`https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/users/show.json?user_id=${uid}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER}`
                }
            }).then(data => data.json()).then(async (data) => {
                if (!session || session.user.id !== parseInt(uid)) {
                    setTitle(`Packs created by @${data.screen_name}`)
                    getPacks(uid);
                } else{
                    setTitle("Your packs");
                    let packs = await localStorage.getItem("ownPacks");

                    if(packs != null){
                        setPacks(JSON.parse(packs));
                    } else{
                        getPacks(uid, false);
                    }
                }

                setUser(data);
            })
        });
    }, [])

    const getPacks = async (id, cache=true) => {
        await fetch(`https://api.winstall.app/packs/${cache ? "users" : "profile"}/${uid}`, {
            method: "GET",
            headers: {
                "Authorization": process.env.NEXT_PUBLIC_TWITTER_SECRET
            }
        }).then(data => data.json()).then(data => {
            setPacks(data);

            if(!cache) localStorage.setItem("ownPacks", JSON.stringify(data));
        })
    }

    return (
        <PageWrapper>
            { user && user.errors ? <MetaTags title={`winstall`} /> : <MetaTags title={`${title} - winstall`} /> }

            {
                (user && user.errors) ? <Error title="User does not exist"/> : (
                    <div>
                            <div className={styles.controls}>
                                <h1>{title}</h1>

                                {/* <Pagination/> */}
                            </div>

                            <ul className={`${styles.all} ${styles.storeList}`}>
                                {packs.map(pack => <li key={pack._id}><PackPreview pack={pack} /></li>)}
                            </ul>
                    </div>
                )
            }

            <SelectionBar />
        </PageWrapper>
    )
}

UserProfile.getInitialProps = async (ctx) => {
    return {
        uid: ctx.query.id
    }
}

export default UserProfile;