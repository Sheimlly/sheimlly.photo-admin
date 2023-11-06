import axios from "axios";

interface PhotoCategories {
    id: number;
    name: string;
    name_pl: string;
}

const Header = () => {
    // const { i18n, t } = useTranslation()

    // const changeLang = (lang_code: string) => {
    //     i18n.changeLanguage(lang_code);
    // }
    
    const handleLogout = () => {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        window.location.href = '/login';
    }

    return (
        <header className="">
            <div className='title-panel d-flex justify-content-center'>
                <h1 className='title-panel--title'>
                    Emilia Lorentsen - Admin
                </h1>
            </div>
            <div className="navigation-panel">
                <div className="container">
                    <div className="row justify-content-center justify-content-md-between">
                        <p className='col-12 col-lg-3'><a href='/'>a</a></p>
                        <p className='col-12 col-lg-3'><a href='/categories'>Categories</a></p>
                        <p className='col-12 col-lg-3'><a href='/sessions'>Sessions</a></p>
                        <p className='col-12 col-lg-3 navigation-panel--logout' onClick={handleLogout}>Logout</p>
                        {/* <p className='col-12 col-lg-3'><a href='/about_me'>{t('header.about_me')}</a></p> */}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;