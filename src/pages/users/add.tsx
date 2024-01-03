import api from "../../helpers/api";
import { FormEvent, useEffect, useState, useRef } from "react";

const RegisterForm = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);

    const [passwordsDontMatch, setPasswordsDontMatch] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        if (passwordRef.current?.value == passwordConfirmationRef.current?.value) {
            e.preventDefault()

            const data = {
                email: emailRef.current?.value,
                username: usernameRef.current?.value,
                password: passwordRef.current?.value,
                password2: passwordRef.current?.value,
            }

            api
                .post('/api/users/register/', data)
                .then(() => window.location.href = '/users')
                .catch(err => console.log(err));
        }
        else {
            setPasswordsDontMatch(true);
        }
    }

    useEffect(() => {
        document.title = 'Add user';
    }, [])
      
    return (
        <section className="container login-page">
            <h2 className="login-page--title">Add user</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input name='email' ref={emailRef} type="email" placeholder="Email" required/><br />
                <input name='username' ref={usernameRef} type="text" placeholder="Username" required/><br />
                <input name='password' ref={passwordRef} type="password" placeholder="Password" required/><br />
                <input name='password' ref={passwordConfirmationRef} type="password" placeholder="Password" required/><br />
                <span style={passwordsDontMatch ? {display: 'block', color: 'red'} : {display: 'none'}}>Passwords must be the same</span>
                <input type="Submit" value="Add user" />
            </form>
        </section>
    )
}

export default RegisterForm;