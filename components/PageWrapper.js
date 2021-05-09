import Footer from "./Footer";

function PageWrapper({ children }){
    return (
        <div>
            {children}

            <Footer/>
        </div>
    )
}

export default PageWrapper;