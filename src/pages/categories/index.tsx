import { Categories } from "../../helpers/interfaces";
import { useState, useEffect } from "react";
import api from "../../helpers/api";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [search, setSearch] = useState<string>();

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/photos/categories/', {
                params: {
                    search: search
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = (id: number) => {
        api.delete(`/api/photos/categories/${id}/`);
        window.location.reload();
    }

    useEffect(() => {
        fetchCategories();
    }, [search]);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Categories</h1>
            </section>

            <section className="container">
            <div className="add-instance"><a href='/categories/add'>+ Add Category</a></div>
                <div className="filtering row my-5">
                    <div className="col-3">
                        <p>Photo name</p>
                        <input onChange={(e) => { setSearch(e.target.value) }} type="text" value={search} />
                    </div>
                </div>

                <div className="categories_sessions-list">
                    {categories.map(category => {
                        return(
                            <div className="row mb-3">
                                <p className="col-2">{category.name}</p>
                                <p className="col-1">-</p>
                                <p className="col-2">{category.name_pl}</p>
                                <button className="col-2 a-button"><a href={`/categories/${category.id}`}>edit</a></button>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}

export default CategoriesPage;