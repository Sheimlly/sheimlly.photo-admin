import { useState, useEffect, FormEvent } from "react";
import { useParams } from 'react-router-dom';
import api from "../../helpers/api";
import { Categories } from "../../helpers/interfaces";

const EditCategory = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [category, setCategory] = useState<Categories>();

    const handleDelete = async () => {
        await api.delete(`/api/photos/categories/${id}/`);
        window.location.href = '/categories';
    }

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        await api.patch(`/api/photos/categories/${id}/`, category);
        window.location.href = '/categories';
    }

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/api/photos/categories/${id}/`);

                const res = await api.get('/api/photos/', {
                    params: {
                        category: response.data.id
                    }
                })

                if (res.data.length === 0) {
                    setCategory({
                        ...response.data,
                        ...{able_to_delete: true} as unknown as Categories
                    })
                }
                else {
                    setCategory(response.data);
                }

            } catch (error) {
                console.log(error);
            }
        }

        document.title = 'Edit category';

        fetchCategory();
    }, []);

    return (
        <section className="form-section container my-5">
            <div className="form-section__container">
                <h1 className="form-section__container--title">Edit category</h1>
                <form className="form-section__container__form" onSubmit={(e) => handleUpdate(e)}>
                    <label className="form-section__container__form--label">Name</label>
                    <input className="form-section__container__form--input" type="text" value={category?.name} onChange={(e) => {setCategory({...category, ...{name: e.target.value} as unknown as Categories})}} placeholder="Name"/>
                    <label className="form-section__container__form--label">Name pl</label>
                    <input className="form-section__container__form--input" type="text" value={category?.name_pl} onChange={(e) => {setCategory({...category, ...{name_pl: e.target.value} as unknown as Categories})}} placeholder="Name pl"/>

                    <div className='form-section__container__form__submit-container'>
                        <input className='form-section__container__form__submit-container--button' type='submit' value='Update' />
                        <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                            </svg>
                        </span>
                    </div>
                </form>

                {category?.able_to_delete &&
                    <p className="delete-button mt-3" onClick={handleDelete}>Delete</p>
                }
            </div>
        </section>
    );
}

export default EditCategory;