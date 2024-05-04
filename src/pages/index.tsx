import { useState, useEffect, useRef } from "react";
import api from "../helpers/api";
import { Photos, Categories, Sessions, PhotoFilters } from '../helpers/interfaces';
import { LinkButton } from "../partials/buttons";

const HomePage = () => {
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
        main_page: false,
    });


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

    const handleRemoveFromMainPage = async (id: number) => {
        api.patch(`/api/photos/${id}/`, {main_page: false});
        window.location.reload();
    }

    const handleFilterChange = (name: string, value: string | boolean | undefined) => {
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

        document.title = 'Admin';

        fetchCategories();
        fetchSessions();
    }, []);

    useEffect(() => {
        fetchPhotos();
    }, [filters]);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Admin</h1>
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
                        
                        <LinkButton text="Add Photo" link="/photos/add" custom_class="filters-section__container__filters--button" />
                    </div>
                </div>
            </section>

            <section className='container photo-page photos-section my-5'>
                <div className='row photos-section__container'>
                    {photos.map((photo, index) => {
                        return (
                            <div className="photos-section__container--photo col-4" ref={ref => { ref && index === photos.length - 1 && setRefElement(ref) }} key={index} style={{'height':imageWidth}}>
                                <img className='photo_with_info' src={photo.image} />
                                <div className='photos-section__container--photo__photo-info' style={{'display':'flex', 'height':imageWidth, 'width':imageWidth}}>
                                    <p className='photos-section__container__photo-info--category'>{photo.category_name}</p>
                                    {photo.session_name ? <p className='photos-section__container__photo-info--category'>{photo.session_name}</p> : ''}
                                    <p className='photos-section__container__photo-info--category'>{photo.date_created}</p>
                                    <a href={`/photos/${photo.id}`} className='photos-section__container--photo__photo-info--button link-button'>Edit</a>
                                    <span className='photos-section__container--photo__photo-info--delete delete-button mt-5' onClick={() => handleRemoveFromMainPage(photo.id)}>Remove from main page</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    );
}

export default HomePage;