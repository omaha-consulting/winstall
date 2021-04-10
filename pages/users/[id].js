import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import Error from "../../components/Error";

function UserProfile({ uid }) {
    const [user, setUser] = useState();
    const [title, setTitle] = useState("Loading...");
    const [packs, setPacks] = useState([]);
    const [status, setStatus] = useState("Getting packs...");

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
                } 
                setUser(data);
            })
        });
    }, [])

    const getPacks = async (id, cache=true) => {
        await fetch(`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/packs/${cache ? "users" : "profile"}/${uid}`, {
            method: "GET",
            headers: {
                "Authorization": process.env.NEXT_PUBLIC_TWITTER_SECRET,
                'AuthKey': process.env.NEXT_PUBLIC_WINGET_API_KEY,
                'AuthSecret': process.env.NEXT_PUBLIC_WINGET_API_SECRET,
            }
        }).then(data => data.json()).then(data => {
            setPacks(data);
            if (data.length === 0) setStatus("This user does not have any packs yet.");
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

                        {user && packs.length === 0 && <p>{status}</p>}
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