import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useParams } from 'react-router-dom';
import api from "../../helpers/api";
import { Categories, Sessions } from "../../helpers/interfaces";

interface Photo {
    id: Number,
    category: Number,
    session?: Number | null,
    date_created: any,
    main_page: Boolean
}

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

        fetchCategory();
    }, []);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Edit category</h1>
            </section>

            <section className="container edit-form">
                <form onSubmit={(e) => handleUpdate(e)}>
                    <div>
                        <label>Name</label>
                        <input type="text" value={category?.name} onChange={(e) => {setCategory({...category, ...{name: e.target.value} as unknown as Categories})}} />
                    </div>

                    <div>
                        <label>Name_pl</label>
                        <input type="text" value={category?.name_pl} onChange={(e) => {setCategory({...category, ...{name_pl: e.target.value} as unknown as Categories})}} />
                    </div>

                    <input className="submit" type="submit" value='Update' />
                </form>

                {category?.able_to_delete &&
                    <div className="mt-5">
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                }
            </section>
        </>
    );
}

export default EditCategory;