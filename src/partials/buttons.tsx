const SubmitButton = (props: {text: string, disabled?: boolean}) => {
    return (
        <div className="form-section__container__form__submit-container">
            <input className="form-section__container__form__submit-container--button" disabled={props.disabled? true : false} type="submit" value={props.text} />
            <span className="form-section__container__form__submit-container--arrow-right arrow-right">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                    <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                </svg>
            </span>
        </div>
    )
}

const LinkButton = (props: {text: string, link: string, custom_class?: string}) => {
    return (
        <button className={props.custom_class + ' link-button'} onClick={() => window.location.href = props.link}>{props.text}</button>
    )
}


export {
    SubmitButton,
    LinkButton
};