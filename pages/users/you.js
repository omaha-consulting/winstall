import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import Error from "../../components/Error";
import { useRouter } from "next/router";

function OwnProfile() {
  const [user, setUser] = useState();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Loading...");

  const router = useRouter();

  useEffect(() => {
    getSession().then(async (session) => {
      if(!session){
        router.push(`/`);
        return;
      };

      let packs = await localStorage.getItem("ownPacks");

      if (packs != null) {
        setPacks(JSON.parse(packs));
        setLoading(false);
      } else {
        getPacks(session.user);
      }

      setUser(session.user)
    });
  }, []);

  const getPacks = async (user) => {
    await fetch(
      `https://api.winstall.app/packs/profile/${user.id}`,
      {
        method: "GET",
        headers: {
          'Authorization': `${user.accessToken},${user.refreshToken}`
        }
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if(data.error){
          setStatus(data.error);
          return;
        };

        setPacks(data);
        setLoading(false);
        localStorage.setItem("ownPacks", JSON.stringify(data));
      });
  };

  const handleDelete = (id) => {
    const newPacks = packs.filter(p => p._id != id);
    setPacks(newPacks);
  }

  return (
    <PageWrapper>
      {user && user.errors ? (
        <MetaTags title={`winstall`} />
      ) : (
        <MetaTags title={`Your packs - winstall`} />
      )}

      <div>
        <div className={styles.controls}>
          <h1>Your Packs</h1>

          {/* <Pagination/> */}
        </div>

        {loading ? (
          <p>{status}</p>
        ) : packs.length === 0 ? (
          <p>You don't have any packs yet. Try creating one first when selecting apps :)</p>
        ) : (
          <ul className={`${styles.all} ${styles.storeList}`}>
            {packs.map((pack) => (
              <li key={pack._id}>
                <PackPreview pack={pack} showDelete={true} auth={user} deleted={handleDelete}/>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SelectionBar />
    </PageWrapper>
  );
}


export default OwnProfile;
