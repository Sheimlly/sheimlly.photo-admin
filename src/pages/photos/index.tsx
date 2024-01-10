import { useState, useEffect, ChangeEvent, useRef } from "react";
import api from "../../helpers/api";
import { Photos, Categories, Sessions, PhotoFilters } from '../../helpers/interfaces';

const PhotosPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [photos, setPhotos] = useState<Photos[] | []>([]);
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [sessions, setSessions] = useState<Sessions[] | []>([]);

    const [filters, setFilters] = useState<PhotoFilters | null>({
        search: undefined,
        category: undefined,
        session: undefined,
        main_page: undefined,
    });

    const handleDelete = async (id: number) => {
        await api.delete(`/api/photos/${id}/`);
        window.location.reload();
    }

    const fetchPhotos = async () => {
        try {
            const response = await api.get('/api/photos/', {
                params: filters,
            });
            setPhotos(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return;
        if (e.target.checked) {
            handleFilterChange('main_page', true)
        }
        else {
            handleFilterChange('main_page', false)
        }
    }

    const handleFilterChange = (name: string, value: string | number | boolean) => {
        if (name == 'session' && value == 'None' || name == 'category' && value == 'None') {
            setFilters({
                ...filters,
                ...{[name]: undefined} as unknown as PhotoFilters
            });
        }
        else {
            setFilters({
                ...filters,
                ...{[name]: value} as unknown as PhotoFilters
            });
        }
    }

    const div_ref = useRef<HTMLDivElement | null>(null);
    const [imageWidth, setImageWidth] = useState<number>(0);

    const setRefElement = (el: HTMLDivElement) => {
        if (!el) return;
        div_ref.current = el;
        setImageWidth(el.offsetWidth);
    };

    window.addEventListener('resize', () => {
        if (div_ref.current) {
            setImageWidth(div_ref.current.offsetWidth)
        }
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/photos/categories/');
                setCategories(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        const fetchSessions = async () => {
            try {
                const response = await api.get('/api/photos/sessions/');
                setSessions(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        document.title = 'Photos ';

        fetchCategories();
        fetchSessions();
    }, []);

    useEffect(() => {
        fetchPhotos();
    }, [filters]);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Photos</h1>
            </section>

            <section className="filters-section container">
                <div className='filters-section__container'>
                    <h3 className='filters-section--title'>Filters</h3>

                    <div className='filters-section__container__filters photo-filters'>
                        <input className='filters-section__container__filters--input' onChange={(e) => { handleFilterChange('search', e.target.value) }} type="text" value={filters?.search} placeholder='Name'/>
                        
                        <div className='filters-section__container__filters__select-container'>
                            <p className='filters-section__container__filters__select-container--text'>Photo category</p>
                            <select className='filters-section__container__filters__select-container--select filters-section__container__filters--select' onChange={(e) => { handleFilterChange('category', e.target.value) }} >
                                <option value='None'>None</option>
                                {categories.map(category => {
                                    return(
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        
                        <div className='filters-section__container__filters__select-container'>
                            <p className='filters-section__container__filters__select-container--text'>Photo session</p>
                            <select className='filters-section__container__filters__select-container--select filters-section__container__filters--select' onChange={(e) => { handleFilterChange('session', e.target.value) }} >
                                <option value='None'>None</option>
                                {sessions.map(session => {
                                    return(
                                        <option key={session.id} value={session.id}>{session.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        
                        <div className='filters-section__container__filters__checkbox-container'>
                            <p className='filters-section__container__filters__select-container--text'>Main page</p>
                            <input className='filters-section__container__filters__checkbox-container--input' type="checkbox" onChange={(e) => handleCheckbox(e)} />
                        </div>
                        
                        <a href='/photos/add' className='filters-section__container__filters--button'>Add Photo</a>
                    </div>
                </div>
            </section>

            <section className='container photos-section my-5'>
                <div className='row photos-section__container'>
                    {photos.map((photo, index) => {
                        return (
                            <div className="photos-section__container--photo col-4" ref={ref => { ref && index === photos.length - 1 && setRefElement(ref) }} key={index} style={{'height':imageWidth}}>
                                <img className='photo_with_info' src={photo.image} />
                                <div className='photos-section__container--photo__photo-info' style={{'display':'flex', 'height':imageWidth, 'width':imageWidth}}>
                                    <p className='photos-section__container__photo-info--category'>{photo.category_name}</p>
                                    {photo.session_name ? <p className='photos-section__container__photo-info--category'>{photo.session_name}</p> : ''}
                                    <p className='photos-section__container__photo-info--category'>{photo.date_created}</p>
                                    <p className='photos-section__container--photo__photo-info--main-page'>Main Page: <span>{photo.main_page ? 'True' : 'False'}</span></p>
                                    <button className='photos-section__container--photo__photo-info--button' onClick={() => handleDelete(photo.id)}>Delete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    );
}

export default PhotosPage;