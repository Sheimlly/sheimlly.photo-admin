import { useState, useEffect, ChangeEvent } from "react";
import api from "../../helpers/api";
import { UserFilters, Users } from '../../helpers/interfaces';

const UserInfoPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const is_admin = (localStorage.getItem("is_admin") == 'true');
    if (!is_admin) {
        window.location.href = '/';
    }

    const [users, setUsers] = useState<Users[] | []>([]);

    const [filters, setFilters] = useState<UserFilters | null>({
        search: undefined,
        is_admin: undefined,
        is_active: undefined,
    });

    const handleCheckbox = (name: string, e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return;
        if (e.target.checked) {
            handleFilterChange(name, true)
        }
        else {
            handleFilterChange(name, undefined)
        }
    }

    const handleFilterChange = (name: string, value: string | boolean | undefined) => {
        setFilters({
            ...filters,
            ...{[name]: value} as unknown as UserFilters
        });
    }

    const handleDelete = async (id: number) => {
        await api.delete(`/api/users/${id}/`);
        window.location.reload();
    }

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users/',{
                params: filters,
            });
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        document.title = 'Users';

        fetchUsers();
    }, [filters]);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Users</h1>
            </section>

            <section className="filters-section container">
                <div className='filters-section__container'>
                    <h3 className='filters-section--title'>Filters</h3>

                    <div className='filters-section__container__filters photo-filters'>
                        <input className='filters-section__container__filters--input' onChange={(e) => { handleFilterChange('search', e.target.value) }} type="text" value={filters?.search} placeholder='Name'/>
                        
                        <div className='filters-section__container__filters__checkbox-container'>
                            <p className='filters-section__container__filters__select-container--text'>Admin</p>
                            <input className='filters-section__container__filters__checkbox-container--input' type="checkbox" onChange={(e) => handleCheckbox('is_admin', e)} />
                        </div>

                        <div className='filters-section__container__filters__checkbox-container'>
                            <p className='filters-section__container__filters__select-container--text'>Active</p>
                            <input className='filters-section__container__filters__checkbox-container--input' type="checkbox" onChange={(e) => handleCheckbox('is_active', e)} />
                        </div>
                        
                        <a href='/users/add' className='filters-section__container__filters--button link-button'>Add User</a>
                    </div>
                </div>
            </section>

            <section className="users-section container">
                <div className="users-section__container row justify-content-between">
                    {users.map(user => {
                        return (
                            <div className="users-section__container__user col-4 my-3" key={user.id}>
                                <p className="users-section__container__user--email">{user.email}</p>
                                <p className="users-section__container__user--text">Is admin: <strong>{user.is_admin ? 'true' : 'false'}</strong></p>
                                <p className="users-section__container__user--text">Is active: <strong>{user.is_active ? 'true' : 'false'}</strong></p>

                                <a className="users-section__container__user--button link-button" href={`/users/${user.id}`}>Edit</a>
                                <p className="users-section__container__user--delete delete-button" onClick={() => handleDelete(user.id)}>Delete</p>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    );
}

export default UserInfoPage;