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
                <div className="navigation-panel__container container">
                    <a className="navigation-panel__container--item" href='/photos'>Photos</a>
                    <a className="navigation-panel__container--item" href='/categories'>Categories</a>
                    <a className="navigation-panel__container--item" href='/sessions'>Sessions</a>
                    <a className="navigation-panel__container--item" href='/userinfo'>User Info</a>
                    <p className='navigation-panel__container--item' onClick={handleLogout}>Logout</p>
                </div>
            </div>
        </header>
    )
}

export default Header;