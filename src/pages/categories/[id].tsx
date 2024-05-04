import { useState, useEffect, FormEvent } from "react";
import { useParams } from 'react-router-dom';
import api from "../../helpers/api";
import { Categories } from "../../helpers/interfaces";
import { SubmitButton } from "../../partials/buttons";

const EditCategory = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }
    
    const { id } = useParams();

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

                    <SubmitButton text='Update' />
                </form>

                {category?.able_to_delete &&
                    <p className="delete-button mt-3" onClick={handleDelete}>Delete</p>
                }
            </div>
        </section>
    );
}

export default EditCategory;