import Footer from "./Footer";

function PageWrapper({ children }){
    return (
        <div className="container">
            {children}

            <Footer/>
        </div>
    )
}

export default PageWrapper;