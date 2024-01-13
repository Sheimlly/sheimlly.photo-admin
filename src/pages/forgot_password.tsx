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
        <section className="form-section auth-page container">
            <div className="form-section__container">
                <h1 className="form-section__container--title">Forgot password</h1>

                <form className="form-section__container__form" onSubmit={(e) => handleSubmit(e)}>
                    <input className="form-section__container__form--input" name='email' ref={emailRef} type="text" placeholder="Email" required/>
                    <div className="form-section__container__form__submit-container">
                        <input className="form-section__container__form__submit-container--button" type="submit" value="Send email" />
                        <span className="form-section__container__form__submit-container--arrow-right arrow-right">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                            </svg>
                        </span>
                    </div>
                </form>

                <div className="form-section__container--email-sent" style={emailSent ? {display:'block'} : {display:'none'}}>
                    <p>Email sent</p>
                </div>
            </div>
        </section>
    )
}

export default ForgotPasswordForm;