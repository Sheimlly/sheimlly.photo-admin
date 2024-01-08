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
                        <button className='filters-section__container__filters--button'><a href='/categories/add'>Add Category</a></button>
                        {/* <div className='filters-section__container__filters__add-button'>
                            <button className='filters-section__container__filters__add-button--button'>Add category</button>
                            <span className='filters-section__container__filters__add-button--add-icon add-icon'>
                                <svg fill="#FFFFFF" version="1.1" id="Capa_1" viewBox="0 0 45.402 45.402">
                                    <g>
                                    <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
                                        c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
                                        c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
                                        c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                                    </g>
                                </svg>
                            </span>
                        </div> */}
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
                                <a className='categories-section__container__category--button' href={`/categories/${category.id}`}>Edit</a>
                                { category.able_to_delete &&
                                    <p className='categories-section__container__category--delete' onClick={() => {handleDelete(category.id)}}>Delete</p>
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