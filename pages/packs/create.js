import { useContext, useState, useEffect } from "react";
import { useSession, signin } from "next-auth/client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import styles from "../../styles/create.module.scss";

import ListPackages from "../../components/ListPackages";
import PackAppsList from "../../components/PackAppsList";
import SelectedContext from "../../ctx/SelectedContext";

import PageWrapper from "../../components/PageWrapper";

import { FiCopy, FiDownload, FiHome, FiPackage, FiTwitter} from "react-icons/fi";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import { route } from "next/dist/next-server/server/router";
import { useRouter } from "next/router";

function Create() {
    const { selectedApps } = useContext(SelectedContext);
    const [session, loading] = useSession(); 
    const [packApps, setPackApps] = useState([]);

    useEffect(() => {
      setPackApps(selectedApps);
    }, [])

    return (
      <PageWrapper>
        <MetaTags title="Create a pack - winstall" />

        <div className={styles.content}>
          <h1>Create a pack</h1>

          {session === null && (
            <>
              <p>Welcome! Login with Twitter to be able to create a pack.</p>
              <button
                className={styles.button}
                onClick={(e) => signin("twitter")}
              >
                <div>
                  <FiTwitter />
                  Login
                </div>
              </button>
            </>
          )}

          {session && packApps.length < 5 ? (
            <>
              <p>You need at least 5 apps to be able to create a pack!</p>
              <Link href="/apps">
                <a className={styles.button}>
                  <div>
                    <FiPackage />
                    Search for more apps
                  </div>
                </a>
              </Link>
            </>
          ) : session ? (
              <CreatePackForm uid={session.user.id} packApps={packApps} />
          ) : (
            ""
          )}

          <br/><br/>

          <PackAppsList providedApps={packApps} reorderEnabled={true} onListUpdate={(apps) => setPackApps(apps)}/>
        </div>

        <SelectionBar/>
      </PageWrapper>
    );
}

const CreatePackForm = ({ uid, packApps }) => {
    const { handleSubmit, register, errors } = useForm();
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState();
    const [error, setError] = useState("");
    const router = useRouter();

    const onSubmit = (values) => {
        setCreating(true);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", process.env.NEXT_PUBLIC_TWITTER_SECRET);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", values.title);
        urlencoded.append("desc", values.description);
        urlencoded.append("apps", packApps.map(i => i._id));
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
                router.push(`/packs/${result._id}`)
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
      <form onSubmit={handleSubmit(onSubmit)} className={styles.createForm}>
        <label>
          Pack title
          <input
            name="title"
            placeholder="Give your pack a name"
            ref={register({
              required: true,
              validate: (value) => { return value.replace(/\s/g, '').length === 0 ? false : true; }
            })}
            autoComplete="off"
          />
          {errors.title && <span className={styles.formError}>Please check the name of your pack!</span>}
        </label>

        <label>
          Pack description
          <input
            name="description"
            ref={register({
                required: true,
                validate: (value) => { return value.replace(/\s/g, '').length === 0 ? false : true; }
            })}
            placeholder="Give your pack a short description"
            autoComplete="off"
          />
          {errors.description && <span className={styles.formError}>Please check the description of your pack!</span>}
        </label>

        <button type="submit" className="button" disabled={creating}>
          {creating ? "Creating..." : "Create pack"}
        </button>

        {error && <p>Couldn't add pack! Error: {error}</p>}
      </form>
    );
}

export default Create;
