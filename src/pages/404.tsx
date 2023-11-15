import { useEffect } from "react";

const NoPage = () => {
    useEffect(() => {
        document.title = '404';
    }, [])
    return (
        <section className="container noPage">
            <h2>404 page not found</h2>
        </section>
    )
}

export default NoPage;