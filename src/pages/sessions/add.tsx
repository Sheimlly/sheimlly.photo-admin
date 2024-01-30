import { ChangeEvent, FormEvent, useRef, useEffect, useState } from 'react';
import { Categories, SessionAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";

interface SessionPhoto {
    category?: number,
    session?: number,
    image: File,
    main_page: boolean,
}

interface Props {
    photos: SessionPhoto[],
    categories: Categories[],
    handleCategoryChange: Function
    handleCheckbox: Function
    deletePhoto: Function
}

const PhotosList = ({photos, categories, handleCategoryChange, handleCheckbox, deletePhoto}:Props ) => {
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

    return (
        <section className='container photos-section '>
            <div className='row photos-section__container'>
                {photos.map((photo, index) => {
                    return (
                        <div className="photos-section__container--photo col-4" ref={ref => { ref && index === photos.length - 1 && setRefElement(ref) }} key={index} style={{'height':imageWidth}}>
                            <img className='photo_with_info session-photos--image' src={URL.createObjectURL(photo.image)} />
                            <div className='photos-section__container--photo__photo-info' style={{'display':'flex', 'height':imageWidth, 'width':imageWidth}}>

                                {/* Category select */}
                                <div className='photos-section__container--photo__photo-info__select-container'>
                                    <select className='photos-section__container--photo__photo-info__select-container--select' onChange={(e) => {handleCategoryChange(e, photo.image)}} required>
                                        <option value='' selected>Please select category</option>
                                        {categories.map(category => {
                                            return(
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            )
                                        })}
                                    </select>
                                    {!photo.category ? <span className='photos-section__container--photo__photo-info__select-container--error'>Plese select category</span> : ''}
                                </div>

                                {/* Main page checkbox */}
                                <div className='photos-section__container--photo__photo-info__checkbox-container'>
                                    <label className='photos-section__container--photo__photo-info__checkbox-container--label'>Main page</label>
                                    <input className='photos-section__container--photo__photo-info__checkbox-container--input' type="checkbox" onChange={(e) => handleCheckbox(e, photo.image)}/>
                                </div>

                                {/* Delete photo */}
                                <p className='photos-section__container--photo__photo-info--button' onClick={() => deletePhoto(photo)}>Delete</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
      );
}

const AddSession = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }
    
    const sessionName = useRef<HTMLInputElement>(null);
    const sessionNamePl = useRef<HTMLInputElement>(null);
    const sessionDateTaken = useRef<HTMLInputElement>(null);



    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [photos, setPhotos] = useState<SessionPhoto[] | []>([]);

    const [categoriesError, setCategoriesError] = useState<boolean>(false);
    const [filenameError, setFilenameError] = useState<boolean>(false);

    const deletePhoto = (instance: SessionPhoto) => {
        setPhotos(prevState =>
            prevState.filter(photo => {
                return photo != instance
            }),
        );
    }

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>, image: File) => {
        if (!e.target) return;

        setPhotos(prevState => {
            const newState = prevState.map(photo => {
                if (photo.image == image) {
                    return {...photo, main_page: e.target.checked} as unknown as SessionPhoto
                }

                return photo;
            })

            return newState;
        })
    }

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>, image: File) => {
        setCategoriesError(false);

        setPhotos(prevState => {
            const newState = prevState.map(obj => {
                if (obj.image == image) {
                    return {...obj, category: e.target.value} as unknown as SessionPhoto
                }

                return obj;
            })

            newState.map(photo => {
                if (!photo.category) {
                    setCategoriesError(true);
                }
            })

            return newState;
        })
    }

    const addPhotos = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFilenameError(false);

        let photos_state = [...photos];
        
        Array.from(e.target.files).map(file => {
            if (file.name.length > 50) {
                setFilenameError(true);
            }
            else {
                photos_state.push({image: file, main_page: false} as unknown as SessionPhoto)
            }
        })

        setPhotos(photos_state);
        setCategoriesError(true);

        e.target.value = '';
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

        photos.map(async (photo: SessionPhoto) => {
            await api.post('/api/photos/',{
                category: photo.category,
                session: response.data.id,
                image: photo.image,
                main_page: photo.main_page,
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
            {/* Forms seciton */}
            <section className='container form-section'>
                
                {/* Session form seciton */}
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
                            <input className='form-section__container__form__submit-container--button' type='submit' disabled={categoriesError} value='Add session' />
                            <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                    <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>

                {/* Photo form seciton */}
                <div className='form-section__container'>
                    <h2 className="form-section__container--title">Add photos to the session</h2>
                    <div className='form-section__container__form__file-container'>
                        <label className='form-section__container__form__file-container--label form-section__container__form--label'>Drop or choose multible images</label>
                        <input className='form-section__container__form__file-container--input form-section__container__form--input multiple-files' id='images' type="file" multiple accept="image/png, image/jpeg" onChange={(e) => {addPhotos(e)}} placeholder='Drop multiple files' />
                        {filenameError ? <p className='form-section__container__form__file-container--error'>Filename is too long (filename can't be longer than 50 characters)</p> : '' }
                    </div>
                </div>
            </section>
            <PhotosList photos={photos} categories={categories} handleCategoryChange={handleCategoryChange} handleCheckbox={handleCheckbox} deletePhoto={deletePhoto} />
        </>
    )
}

export default AddSession;