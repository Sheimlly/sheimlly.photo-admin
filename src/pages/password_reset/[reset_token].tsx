import api from "../../helpers/api";
import { useEffect, useRef, FormEvent } from "react";
import { useParams } from "react-router";

const PasswordResetForm = () => {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = '/login';
    }

    const reset_token = useParams();

    console.log(reset_token.reset_token);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = {
            token: reset_token.reset_token,
            password: passwordRef.current?.value,
            password2: passwordConfirmationRef.current?.value,
        }

        api
            .post('/api/users/password_reset/confirm/', data)
            .then(() => window.location.href = '/login/?passwordReset=true')
            .catch(err => console.log(err));
    }

    useEffect(() => {
        document.title = 'Forgot password';
    }, [])
      
    return (
        <section className="container login-page">
            <h2 className="login-page--title">Password reset</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input name='password' ref={passwordRef} type="password" placeholder="Password" required/>
                <input name='passwordConfirmation' ref={passwordConfirmationRef} type="password" placeholder="Confirm password " required/>
                <input type="submit" value="Reset password" />
            </form>
        </section>
    )
}

export default PasswordResetForm;