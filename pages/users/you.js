import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/client";
import Error from "../../components/Error";

function OwnProfile() {
  const [user, setUser] = useState();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(async (session) => {
      if(!session) return;

      let packs = await localStorage.getItem("ownPacks");

      if (packs != null) {
        setPacks(JSON.parse(packs));
        setLoading(false);
      } else {
        getPacks(session.user.id);
      }
    });
  }, []);

  const getPacks = async (id) => {
    await fetch(
      `https://api.winstall.app/packs/profile/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TWITTER_SECRET,
        },
      }
    )
      .then((data) => data.json())
      .then((data) => {
        setPacks(data);
        setLoading(false);
        localStorage.setItem("ownPacks", JSON.stringify(data));
      });
  };

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
          <p>Loading....</p>
        ) : packs.length === 0 ? (
          <p>You don't have any packs yet. Try creating one first when selecting apps :)</p>
        ) : (
          <ul className={`${styles.all} ${styles.storeList}`}>
            {packs.map((pack) => (
              <li key={pack._id}>
                <PackPreview pack={pack} />
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
