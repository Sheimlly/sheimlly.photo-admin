const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = '/login';
    }

    return (
        <header className="">
            <div className='title-panel d-flex justify-content-center'>
                <h1 className='title-panel--title'>
                    <a href='/'>Emilia Lorentsen - Admin</a>
                </h1>
            </div>
            <div className="navigation-panel">
                <div className="container">
                    <div className="row justify-content-center justify-content-md-between">
                        <p className='col-12 col-lg-2'><a href='/photos'>Photos</a></p>
                        <p className='col-12 col-lg-3'><a href='/categories'>Categories</a></p>
                        <p className='col-12 col-lg-3'><a href='/sessions'>Sessions</a></p>
                        <p className='col-12 col-lg-2'><a href='/userinfo'>User Info</a></p>
                        <p className='col-12 col-lg-3 navigation-panel--logout' onClick={handleLogout}>Logout</p>
                        {/* <p className='col-12 col-lg-3'><a href='/about_me'>{t('header.about_me')}</a></p> */}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;