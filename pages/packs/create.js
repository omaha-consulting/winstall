import { useContext, useState, useEffect } from "react";
import { useSession, signin, signout, getSession, session } from "next-auth/client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import styles from "../../styles/home.module.scss";
import form from "../../styles/create.module.scss";

import ListPackages from "../../components/ListPackages";
import SingleApp from "../../components/SingleApp";
import SelectedContext from "../../ctx/SelectedContext";

import Footer from "../../components/Footer";

import { FiCopy, FiDownload, FiHome, FiPackage, FiTwitter} from "react-icons/fi";
import MetaTags from "../../components/MetaTags";

function Create() {
    const { selectedApps } = useContext(SelectedContext);
    const [session, loading] = useSession();

    return (
        <div className="container generate-container">
            <MetaTags title="winstall - GUI for Windows Package Manager" />
            <div className="illu-box">
                <div className={styles.generate}>
                    <h1>Create a pack</h1>

                    { session === null && (
                        <>
                            <p>Welcome! Login with Twitter to be able to create a pack.</p>
                            <button className="button" onClick={e => signin("twitter")}>
                                <FiTwitter />
                                Login
                            </button>
                        </>
                    )}

                    {
                        (session && selectedApps.length < 5) ? (
                            <>
                                <p>You need at least 5 apps to be able to create a pack!</p>
                                <Link href="/apps">
                                    <a className="button">
                                        <FiPackage />
                                        Search for more apps
                                    </a>
                                </Link>
                            </>
                        ) : (session ? <CreatePackForm uid={session.user.id} selectedApps={selectedApps}/> : "")
                    }
                </div>

                <div className="art">
                    <img src="/assets/dl.svg" draggable={false} alt="download icon" />
                </div>
            </div>

            {
                selectedApps.length > 0 && (
                    <div className={styles.selectedApps}>
                        <h2>Apps in this pack ({selectedApps.length})</h2>
                        <ListPackages showImg={true}>
                            {selectedApps.map((app) => (
                                <SingleApp app={app} key={app._id} />
                            ))}
                        </ListPackages>
                    </div>
                )
            }

            <Footer />
        </div>
    );
}

const CreatePackForm = ({ uid, selectedApps }) => {
    const { handleSubmit, register, errors } = useForm();
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState();
    const [error, setError] = useState("");

    const onSubmit = (values) => {
        setCreating(true);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", process.env.NEXT_PUBLIC_TWITTER_SECRET);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", values.title);
        urlencoded.append("desc", values.description);
        urlencoded.append("apps", selectedApps.map(i => i._id));
        urlencoded.append("creator", uid);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://api.winstall.app/packs/create", requestOptions)
            .then(async (response) => {
                if(response.status !== 200){
                    const res = await response.json();
                    setCreating(false);
                    setError(res.error);
                    return;
                }

                return response.json()
            })
            .then(result => {
                setCreated(result)
            })
            .catch(error => {
                setCreating(false);
                setError(error.message);
            });
    };

    if(created){
        return (
            <p>Your pack "{created.title}" has been sucesfully created! You can view it here: <Link href="/packs/[id]" as={`/packs/${created._id}`}><a>winstall.app/packs/{created._id}</a></Link></p>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={form.createForm}>
            <label>
                Pack title
                <input
                    name="title"
                    placeholder="Give your pack a name"
                    ref={register}
                    required={true}
                    autoComplete="off"
                />

                {errors.title && errors.title.message}
            </label>

            <label>
                Pack description
                <input
                    name="description"
                    ref={register}
                    placeholder="Give your pack a short description"
                    autoComplete="off"
                />

                {errors.description && errors.description.message}
            </label>
            
            <button type="submit" className="button" disabled={creating}>{creating ? "Creating..." : "Create pack"}</button>

            {error && <p>Couldn't add pack! Error: {error}</p>}
        </form>
    )
}

export default Create;
