import api from "../helpers/api";
import { useState } from "react";

const LoginForm = () => {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = '/';
    }

    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleSubmit = () => {
        api
            .post('/api/token/', {
                username: username,
                password: password,
            })
            .then(response => {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                window.location.href = '/';
            })
            .catch(err => console.log(err));
    }

      
    return (
        <section className="container login-page">
            <h2 className="login-page--title">Login</h2>
            <div>
                <input name='login' onChange={e => setUsername(e.target.value)} type="text" placeholder="Login" required/>
                <input name='password' onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required/>
                <input type="button" onClick={handleSubmit} value="Submit" />
            </div>
        </section>
    )
}

export default LoginForm;