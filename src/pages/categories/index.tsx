import { Categories } from "../../helpers/interfaces";
import { useState, useEffect } from "react";
import api from "../../helpers/api";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [search, setSearch] = useState<string>();

    const handleDelete = async (id: number) => {
        await api.delete(`/api/photos/categories/${id}/`);
        window.location.reload();
    }

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/photos/categories/', {
                params: {
                    search: search
                }
            });
            
            setCategories(response.data);

            response.data.map(async (cat: Categories) => {
                const res = await api.get('/api/photos/', {
                    params: {
                        category: cat.id
                    }
                });
                
                if (res.data.length === 0) {
                    const newCategories = response.data.map((c: Categories) => {
                        if (c.id === cat.id) {
                          return {
                            ...c,
                            able_to_delete: true
                          }
                        } else {
                          return c
                        }
                    })

                    setCategories(newCategories);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [search]);

    useEffect(() => {
        document.title = 'Categories';
    }, [])

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Categories</h1>
            </section>

            <section className="filters-section container">
                <div className='filters-section__container'>
                    <h3 className='filters-section--title'>Filters</h3>

                    <div className='filters-section__container__filters'>
                        <input className='filters-section__container__filters--input' onChange={(e) => { setSearch(e.target.value) }} type="text" value={search} placeholder='Name'/>
                        <a href='/categories/add' className='filters-section__container__filters--button link-button'>Add Category</a>
                    </div>
                </div>
            </section>

            <section className='categories-section container my-5'>
                <div className='categories-section__container row justify-content-between'>
                    {categories.map(category => {
                        return(
                            <div className='categories-section__container__category col-4 my-3'>
                                <div className='categories-section__container__category--text'>
                                    <p>{category.name}</p>
                                    <span> - </span>
                                    <p>{category.name_pl}</p>
                                </div>
                                <a className='categories-section__container__category--button link-button' href={`/categories/${category.id}`}>Edit</a>
                                { category.able_to_delete &&
                                    <p className='categories-section__container__category--delete delete-button' onClick={() => {handleDelete(category.id)}}>Delete</p>
                                }
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}

export default CategoriesPage;