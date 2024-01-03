import api from "../helpers/api";
import { useEffect, useRef, FormEvent, useState } from "react";

const ForgotPasswordForm = () => {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = '/login';
    }

    const emailRef = useRef<HTMLInputElement>(null);

    const [emailSent, setEmailSent] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = {
            email: emailRef.current?.value,
        }

        api
            .post('/api/users/password_reset/', data)
            .then(() => setEmailSent(true))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        document.title = 'Forgot password';
    }, [])
      
    return (
        <section className="container login-page">
            <h2 className="login-page--title">Forgot password</h2>

            <form onSubmit={(e) => handleSubmit(e)}>
                <input name='email' ref={emailRef} type="text" placeholder="Email" required/>
                <input type="submit" value="Send email" />
            </form>

            <div style={emailSent ? {display:'block'} : {display:'none'}}>
                <p>Email sent</p>
            </div>
        </section>
    )
}

export default ForgotPasswordForm;