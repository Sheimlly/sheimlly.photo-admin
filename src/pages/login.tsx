import api from "../helpers/api";
import { useEffect, useRef, FormEvent } from "react";

const LoginForm = () => {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = '/';
    }

    const search = window.location.search; // returns the URL query String
    const params = new URLSearchParams(search); 
    const passwordReset = params.get('passwordReset'); 

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
        }

        api
            .post('/api/users/token/', data)
            .then(response => {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                window.location.href = '/';
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        document.title = 'Login';
    }, [])
      
    return (
        <section className="container login-page">
            {passwordReset ?
                <div className="login-page__password-reset">
                    <p>Password reset completed</p>
                </div>
                :
                <></>
            }
            <h2 className="login-page--title">Login</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input name='email' ref={emailRef} type="email" placeholder="Email" required/>
                <input name='password' ref={passwordRef} type="password" placeholder="Password" required/>
                <input type="submit" value="LogIn" />
            </form>
            <button onClick={() => window.location.href = '/forgot_password'}>Forget password</button>
        </section>
    )
}

export default LoginForm;