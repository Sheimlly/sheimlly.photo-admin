import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useParams } from 'react-router-dom';
import api from "../../helpers/api";
import { Users } from "../../helpers/interfaces";
import { SubmitButton } from "../../partials/buttons";

const EditUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }
    const is_superuser = (localStorage.getItem("is_superuser") == 'true');
    const is_admin = (localStorage.getItem("is_admin") == 'true');
    if (!is_admin) {
        window.location.href = '/';
    }

    const { id } = useParams();

    const [user, setUser] = useState<Users>();
    const [admin, setAdmin] = useState<boolean>();

    const handleCheckbox = (name: string, e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return;
        if (e.target.checked) {
            setUser({
                ...user,
                ...{[name]: true} as unknown as Users,
            })
        }
        else {
            setUser({
                ...user,
                ...{[name]: false} as unknown as Users,
            })
        }
    }

    const handleDelete = async () => {
        await api.delete(`/api/users/${id}/`);
        window.location.href = '/users';
    }

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        await api.patch(`/api/users/${id}/`, user);
        window.location.href = '/users';
    }

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/api/users/${id}/`);
                setUser(response.data);
                setAdmin(response.data.is_admin)
            } catch (error) {
                console.log(error);
            }
        }

        document.title = 'Edit user';

        fetchCategory();
    }, []);

    return (
        <section className="form-section container my-5">
            <div className="form-section__container">
                <h1 className="form-section__container--title">Edit User</h1>

                <form className="form-section__container__form" onSubmit={(e) => handleUpdate(e)}>
                    {!admin || is_superuser ?
                        <div className="form-section__container__form__checkbox-container">
                            <label className="form-section__container__form__checkbox-container--label">Admin</label>
                            <input className="form-section__container__form__checkbox-container--input" type="checkbox" checked={user?.is_admin ? true : false } onChange={(e) => { handleCheckbox('is_admin', e) }} />
                        </div>
                    : '' }

                    <div className="form-section__container__form__checkbox-container">
                        <label className="form-section__container__form__checkbox-container--label">Active</label>
                        <input className="form-section__container__form__checkbox-container--input" type="checkbox" checked={user?.is_active ? true : false } onChange={(e) => { handleCheckbox('is_active', e) }} />
                    </div>

                    <SubmitButton text='Update' />
                </form>

                {!admin || is_superuser? <p className='delete-button mt-3' onClick={handleDelete}>Delete</p> : '' }
            </div>
        </section>
    );
}

export default EditUser;