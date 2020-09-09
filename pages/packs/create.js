import { useContext, useState, useEffect } from "react";
import { getSession, signin } from "next-auth/client";

import Link from "next/link";

import styles from "../../styles/create.module.scss";

import PackAppsList from "../../components/PackAppsList";
import SelectedContext from "../../ctx/SelectedContext";

import PageWrapper from "../../components/PageWrapper";

import { FiPackage, FiTwitter} from "react-icons/fi";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import CreatePackForm from "../../components/CreatePackForm";

function Create() {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const [user, setUser] = useState(); 
    const [packApps, setPackApps] = useState([]);

    useEffect(() => {
      setPackApps(selectedApps);

      const restoreBackup = async () => {
        const checkForBackup = await localStorage.getItem("winstallLogin")

        const backup = JSON.parse(checkForBackup);

        if(!backup) return;

        setSelectedApps(backup);
        setPackApps(backup);

        await localStorage.removeItem("winstallLogin");

      }

      restoreBackup();

      getSession().then(async (session) => {
        if(!session) return;

        if(session.user) setUser(session.user);
      });

    }, [])

    const handleLogin = async () => {
      const appsBackup = JSON.stringify(selectedApps);
      
      await localStorage.setItem("winstallLogin", appsBackup);

      signin("twitter");
    }

    return (
      <PageWrapper>
        <MetaTags title="Create a pack - winstall" />

        <div className={styles.content}>
          <h1>Create a pack</h1>

          {!user && (
            <>
              <p>Welcome! Login with Twitter to be able to create a pack.</p>
              <button
                className={styles.button}
                onClick={handleLogin}
              >
                <div>
                  <FiTwitter />
                  Login
                </div>
              </button>
            </>
          )}

          {user && packApps.length < 5 ? (
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
          ) : user ? (
              <CreatePackForm user={user} packApps={packApps} />
          ) : (
            <></>
          )}

          <br/><br/>

          <PackAppsList notLoggedIn={user === null} providedApps={packApps} reorderEnabled={true} onListUpdate={(apps) => setPackApps(apps)}/>
        </div>

        <SelectionBar hideCreatePack={true}/>
      </PageWrapper>
    );
}


export default Create;
