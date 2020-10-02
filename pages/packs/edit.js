import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/client'
import Error from "../../components/Error";
import PageWrapper from '../../components/PageWrapper';
import MetaTags from '../../components/MetaTags';
import styles from "../../styles/create.module.scss";
import SelectionBar from '../../components/SelectionBar';
import Router from "next/router";
import CreatePackForm from '../../components/CreatePackForm';
import PackAppsList from '../../components/PackAppsList';
import Link from "next/link";
import { FiPackage } from 'react-icons/fi';

export default function Edit({ allApps }) {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [packId, setPackId] = useState();
    const [pack, setPack] = useState();
    const [notFound, setNotFound] = useState(false);
    const [accessDenied, denyAccess] = useState(false);
    const [packApps, setPackApps] = useState([]);
    

    useEffect(() => {
        getSession().then(async (session) => {
            if (session && session.user) setUser(session.user);

            setPackId(Router.query.id);
                        
            if(session && session.user && Router.query.id){
                checkPack(Router.query.id, session.user.id);
            } else{
                setLoading(false);
            }
        });
    
    }, [])

    const checkPack = async (id, userId) => {
        let pack = await fetch(`https://api.winstall.app/packs/${id}`).then(res => res.status === 200 ? res.json() : null);

        if(!pack){
            setNotFound(true);
            setLoading(false);
            return;
        }

        if (pack.creator === userId){
            const appsList = pack.apps;

            const getIndividualApps = appsList.map(async (app, index) => {
                return new Promise(async (resolve) => {
                    let appData = await fetch(`https://api.winstall.app/apps/${app._id}`).then(res => res.json());
                    appsList[index] = appData;
                    resolve();
                })
            })

            await Promise.all(getIndividualApps).then(() => {
                pack.apps = appsList;
            })

            setPack(pack);
            setPackApps(pack.apps);
            setLoading(false);
        } else{
            setLoading(false);
            denyAccess(true);
        }

    }

    if (loading) return <PageWrapper><p>Loading...</p></PageWrapper>

    // If no session exists, display access denied message
    if (!user) return <Error title="You are not logged in!" subtitle="Please login first to be able to edit a pack."/>

    // If no pack ID query, return error
    if (!packId || notFound)  return <Error title="No pack found" subtitle="You are trying to edit a pack that doesn't exist." />

    // If pack isn't owned by this user
    if (accessDenied) return <Error title="Access Denied" subtitle="You are trying to edit a pack that you don't own." />

    // If everything passes, let them edit
    if(!pack) return <></>;

    const updatePackApps = (apps) => {
        setPackApps(apps);
    }

    return (
        <PageWrapper>
            <MetaTags title="Edit pack - winstall" />

            <div className={styles.content}>
                <h1>Edit Pack</h1>

                <CreatePackForm user={user} packApps={packApps} editMode={true} defaultValues={{ _id: pack._id, title: pack.title, description: pack.desc, accent: pack.accent }} />

                {/* <p>Note: it may take up to 10 minutes for your changes to apply for you and others on the site.</p> */}

                <br/><br/>

                <PackAppsList notLoggedIn={user === null} allApps={allApps} providedApps={packApps} reorderEnabled={true} onListUpdate={updatePackApps} />
            </div>
            <SelectionBar hideCreatePack={true} />
        </PageWrapper>
    )
}

export async function getStaticProps() {
    let apps = await fetch(`https://api.winstall.app/apps`).then((res) =>
        res.json()
    );

    return {
        props: {
            allApps: apps,
        },
    };
}
