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

const EditPhoto = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [image, setImage] = useState();
    const [photo, setPhoto] = useState<Photo>();
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [sessions, setSessions] = useState<Sessions[] | []>([]);

    const handleDelete = async () => {
        await api.delete(`/api/photos/${id}/`);
        window.location.href = '/photos';
    }

    const handleUpdate = async (e: FormEvent) => {
        if(photo && photo.session instanceof String) {
            setPhoto({
                ...photo,
                ...{session: undefined} as unknown as Photo,
            })
        }
        e.preventDefault();
        await api.patch(`/api/photos/${id}/`, photo);
        window.location.href = '/photos';
    }

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return;
        if (e.target.checked) {
            setPhoto({
                ...photo,
                ...{main_page: true} as unknown as Photo,
            })
        }
        else {
            setPhoto({
                ...photo,
                ...{main_page: false} as unknown as Photo,
            })
        }
    }

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await api.get(`/api/photos/${id}/`);
                setPhoto({
                    id: response.data.id,
                    category: response.data.category,
                    session: response.data.session,
                    date_created: response.data.date_created,
                    main_page: response.data.main_page,
                });
                setImage(response.data.image);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchCategories = async () => {
            try {
                const response = await api.get(`/api/photos/categories/`);
                setCategories(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchSessions = async () => {
            try {
                const response = await api.get(`/api/photos/sessions/`);
                setSessions(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        document.title = 'Edit photo';

        fetchPhoto();
        fetchCategories();
        fetchSessions();
    }, []);

    return (
        <>
            <section className="site_header container my-5">
                <h1>Edit Photo</h1>
            </section>

            <section className="form-section container">
                {photo &&
                    <div className="row form-section__container edit-photo__container justify-content-between my-3">
                        <img className="col-6" src={image} />
                        <div className="col-6 ">
                            <form className='form-section__container__form' onSubmit={(e) => handleUpdate(e)}>
                                <div className='form-section__container__form__select-container'>
                                    <label className='form-section__container__form__select-container--label form-section__container__form--label'>Category</label>
                                    <select className='form-section__container__form__select-container--select form-section__container__form--select' onChange={(e) => {setPhoto({...photo, ...{category: e.target.value} as unknown as Photo})}}>
                                        {categories.map(category => {
                                            return(
                                                <option key={category.id} value={category.id} selected={category.id == photo.category}>{category.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className='form-section__container__form__select-container'>
                                    <label className='form-section__container__form__select-container--label form-section__container__form--label'>Session</label>
                                    <select className='form-section__container__form__select-container--select form-section__container__form--select' onChange={(e) => {setPhoto({...photo, ...{session: e.target.value} as unknown as Photo})}}>
                                        <option>None</option>
                                        {sessions.map(session => {
                                            return(
                                                <option key={session.id} value={session.id} selected={session.id == photo.session}>{session.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className='form-section__container__form__date-container'>
                                    <label className='form-section__container__form__date-container--label form-section__container__form--label'>Date created</label>
                                    <input className='form-section__container__form__date-container--input form-section__container__form--input' type="date" onChange={(e) => {setPhoto({...photo, ...{date_created: e.target.value} as unknown as Photo})}} defaultValue={photo.date_created} />
                                </div>
                                <div className='form-section__container__form__checkbox-container'>
                                    <label className='form-section__container__form__checkbox-container--label form-section__container__form--label'>Main page</label>
                                    <input className='form-section__container__form__checkbox-container--input form-section__container__form--input' type="checkbox" onChange={(e) => handleCheckbox(e)} checked={photo.main_page ? true : false} />
                                </div>

                                <div className='form-section__container__form__submit-container'>
                                    <input className='form-section__container__form__submit-container--button' type='submit' value='Update' />
                                    <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                            <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                        </svg>
                                    </span>
                                </div>
                            </form>
                            <p className="delete-button" onClick={handleDelete}>Delete</p>
                        </div>
                    </div>
                }
            </section>
        </>
    );
}

export default EditPhoto;