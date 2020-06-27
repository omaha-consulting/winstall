import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import styles from "../../styles/home.module.scss";

import ListPackages from "../../components/ListPackages";
import SingleApp from "../../components/SingleApp";
import SelectedContext from "../../ctx/SelectedContext";

import Footer from "../../components/Footer";

import { FiCopy, FiDownload, FiHome } from "react-icons/fi";
import MetaTags from "../../components/MetaTags";

function Create() {
    const { selectedApps } = useContext(SelectedContext);

    const { handleSubmit, register, errors } = useForm();
    const onSubmit = values => console.log(values);

    return (
        <div className="container generate-container">
            <MetaTags title="winstall - GUI for Windows Package Manager" />
            <div className="illu-box">
                <div className={styles.generate}>
                    <h1>Create a pack</h1>
                    <h3>
                        Make sure you select some apps first to be able to generate a
                        script :)
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            name="email"
                            ref={register({
                                required: "Required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "invalid email address"
                                }
                            })}
                        />
                        {errors.email && errors.email.message}

                        <input
                            name="username"
                            ref={register({
                                validate: value => value !== "admin" || "Nice try!"
                            })}
                        />
                        {errors.username && errors.username.message}

                        <button type="submit">Submit</button>
                    </form>
                </div>

                <div className="art">
                    <img src="/assets/dl.svg" draggable={false} alt="download icon" />
                </div>
            </div>

            <div className={styles.selectedApps}>
                <h2>Apps in this pack ({selectedApps.length})</h2>
                <ListPackages showImg={true}>
                    {selectedApps.map((app) => (
                        <SingleApp app={app} key={app._id} onVersionChange={handleScriptChange} />
                    ))}
                </ListPackages>
            </div>

            <Footer />
        </div>
    );
}

export default Create;
