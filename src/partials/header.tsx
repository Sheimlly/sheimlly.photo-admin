const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("is_admin");
        window.location.href = '/login';
    }

    const is_admin = (localStorage.getItem("is_admin") == 'true');

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
                    {is_admin ? <a className="navigation-panel__container--item" href='/users'>Users</a> : ''}
                    <p className='navigation-panel__container--item' onClick={handleLogout}>Logout</p>
                </div>
            </div>
        </header>
    )
}

export default Header;