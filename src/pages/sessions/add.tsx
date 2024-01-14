import { ChangeEvent, FormEvent, useRef, useEffect, useState} from 'react';
import { Categories, SessionAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";

interface SessionPhoto {
    category: number,
    session?: number ,
    image: File,
    main_page: boolean,
}

interface Props {
    photos: SessionPhoto[],
    categories: Categories[],
    deletePhoto: Function
}

const PhotosList = ({photos, categories, deletePhoto}:Props ) => {
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

    // const x = URL.createObjectURL(photos[0].image)
    return (
        <section className='container photos-section '>
            <div className='row photos-section__container'>
                {photos.map((photo, index) => {
                    return (
                        <div className="photos-section__container--photo col-4" ref={ref => { ref && index === photos.length - 1 && setRefElement(ref) }} key={index} style={{'height':imageWidth}}>
                            <img className='photo_with_info' src={URL.createObjectURL(photo.image)} />
                            <div className='photos-section__container--photo__photo-info' style={{'display':'flex', 'height':imageWidth, 'width':imageWidth}}>
                                {categories.map(category => {
                                    return category.id == photo.category ? <p className='photos-section__container__photo-info--category'>Category: <span>{category.name}</span></p> : ''
                                })}
                                <p className='photos-section__container--photo__photo-info--main-page'>Main Page: <span>{photo.main_page ? 'True' : 'False'}</span></p>
                                <button className='photos-section__container--photo__photo-info--button' onClick={() => deletePhoto(photo)}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
      );
}

const AddSession = () => {
    const sessionName = useRef<HTMLInputElement>(null);
    const sessionNamePl = useRef<HTMLInputElement>(null);
    const sessionDateTaken = useRef<HTMLInputElement>(null);



    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [photos, setPhotos] = useState<SessionPhoto[] | []>([]);
    const [photo, setPhoto] = useState<SessionPhoto | null>(null);

    const photoForm = useRef<HTMLFormElement>(null);

     // Manage food in order state
     const addPhoto = (e: FormEvent) => {
        if(photo) {
            if(!photo.main_page) {
                setPhoto({
                    ...photo,
                    ...{main_page: false} as unknown as SessionPhoto,
                })
            }
            let p = [...photos];
            p.push(photo);
            setPhotos(p);
            setPhoto(null);
        }
        e.preventDefault();
        photoForm.current?.reset();
    }


    const deletePhoto = (instance: SessionPhoto) => {
        setPhotos(current =>
            current.filter(p => {
                return p != instance
            }),
        );
    }

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return;
        if (e.target.checked) {
            setPhoto({
                ...photo,
                ...{main_page: true} as unknown as SessionPhoto,
            })
        }
        else {
            setPhoto({
                ...photo,
                ...{main_page: false} as unknown as SessionPhoto,
            })
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        
        setPhoto({
            ...photo,
            ...{image: e.target.files[0]} as unknown as SessionPhoto
        });
    }

    const addSession = async (e: FormEvent) => {
        e.preventDefault();

        const data : SessionAdd = {
            name: sessionName.current?.value,
            name_pl: sessionNamePl.current?.value,
            date_taken: sessionDateTaken.current?.value
        }

        const response = await api.post('/api/photos/sessions/', data);

        console.log(response.data);

        photos.map(async (p: SessionPhoto) => {
            await api.post('/api/photos/',{
                category: p.category,
                session: response.data.id,
                image: p.image,
                main_page: p.main_page,
            },{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        })
        window.location.href = '/sessions';
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/photos/categories/');
                setCategories(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        
        document.title = 'Add session';

        fetchCategories();
    }, [])

    return (
        <>
            <section className='container form-section'>
                <div className='form-section__container'>
                    <h1 className='form-section__container--title'>Add Session</h1>
                    <form className='form-section__container__form' onSubmit={(e) => addSession(e)}>
                        <input className='form-section__container__form--input' type='text' ref={sessionName} placeholder='Name' required />
                        <input className='form-section__container__form--input' type='text' ref={sessionNamePl} placeholder='Name pl' required />
                        <div className='form-section__container__form__date-container'>
                            <label className='form-section__container__form__date-container--label form-section__container__form--label'>Date taken</label>
                            <input className='form-section__container__form__date-container--input form-section__container__form--input' type='date' ref={sessionDateTaken} required />
                        </div>
                        <div className='form-section__container__form__submit-container'>
                            <input className='form-section__container__form__submit-container--button' type='submit' value='Add session' />
                            <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                    <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>

                <div className='form-section__container'>
                    <h2 className="form-section__container--title">Add session photos</h2>
                    <form className='form-section__container__form' ref={photoForm} onSubmit={(e) => addPhoto(e)}>
                        <div className='form-section__container__form__file-container'>
                            <label className='form-section__container__form__file-container--label form-section__container__form--label'>Image</label>
                            <input className='form-section__container__form__file-container--input form-section__container__form--input' type="file" accept="image/png, image/jpeg" onChange={(e) => {handleFileChange(e)}} required />
                        </div>
                        <div className='form-section__container__form__select-container'>
                            <label className='form-section__container__form__select-container--label form-section__container__form--label'>Category</label>
                            <select className='form-section__container__form__select-container--select form-section__container__form--select' onChange={(e) => {setPhoto({...photo, ...{category: e.target.value} as unknown as SessionPhoto})}} required>
                                <option value='' selected>Please select category</option>
                                {categories.map(category => {
                                    return(
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='form-section__container__form__checkbox-container'>
                            <label className='form-section__container__form__checkbox-container--label form-section__container__form--label'>Main page</label>
                            <input className='form-section__container__form__checkbox-container--input form-section__container__form--input' type="checkbox" onChange={(e) => handleCheckbox(e)}/>
                        </div>

                        <div className='form-section__container__form__submit-container'>
                            <input className='form-section__container__form__submit-container--button' type='submit' value='Add photo' />
                            <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                    <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
            </section>
            <PhotosList photos={photos} categories={categories} deletePhoto={deletePhoto} />
        </>
    )
}

export default AddSession;