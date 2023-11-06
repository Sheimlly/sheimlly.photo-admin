import { setAuthToken } from "../helpers/setAuthToken";

const HomePage = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    else {
        window.location.href = '/login';
    }

    return (
        <h1>homepage</h1>
    );
}

export default HomePage;