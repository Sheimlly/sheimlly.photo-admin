import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Categories, Sessions, PhotoAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";
import { SubmitButton } from '../../partials/buttons';

const AddPhoto = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }
    
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [sessions, setSessions] = useState<Sessions[] | []>([]);

    const [photo, setPhoto] = useState<PhotoAdd>({
        image: undefined,
        category: undefined,
        session: undefined,
        date_created: undefined,
        main_page: false,
    });

    const [filenameError, setFilenameError] = useState<boolean>(false);

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return;
        if (e.target.checked) {
            setPhoto({
                ...photo,
                ...{main_page: true} as unknown as PhotoAdd,
            })
        }
        else {
            setPhoto({
                ...photo,
                ...{main_page: false} as unknown as PhotoAdd,
            })
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return; 
        setFilenameError(false);

        if (e.target.files[0].name.length > 50) {
            setFilenameError(true);
            e.target.value = '';
        }
        else {
            setPhoto({
                ...photo,
                ...{image: e.target.files[0]} as unknown as PhotoAdd
            });
        }
    }

    const addPhoto = (e: FormEvent) => {
        console.log(photo);
        e.preventDefault();
        api.post('/api/photos/', photo, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .catch(err => {
            console.log(err);
        });
        window.location.href = '/photos';
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/photos/categories/');
                setCategories(response.data);
                setPhoto({
                    ...photo,
                    ...{category: response.data[0].id} as unknown as PhotoAdd
                });
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

        document.title = 'Add photo';

        fetchCategories();
        fetchSessions();
    }, []);

    return (
        <section className='container form-section addphoto-page'>
            <div className='form-section__container'>
                <h1 className='form-section__container--title'>Add photo</h1>
                <form className='form-section__container__form' onSubmit={(e) => addPhoto(e)}>
                    <div className='form-section__container__form__file-container'>
                        <label className='form-section__container__form__file-container--label form-section__container__form--label'>Image</label>
                        <input className='form-section__container__form__file-container--input form-section__container__form--input' type="file" accept="image/png, image/jpeg" onChange={(e) => {handleFileChange(e)}} required />
                        {filenameError ? <p className='form-section__container__form__file-container--error'>Filename is too long (filename can't be longer than 50 characters)</p> : '' }
                    </div>
                    <div className='form-section__container__form__select-container'>
                        <label className='form-section__container__form__select-container--label form-section__container__form--label'>Category</label>
                        <select className='form-section__container__form__select-container--select form-section__container__form--select' onChange={(e) => {setPhoto({...photo, ...{category: e.target.value} as unknown as PhotoAdd})}} required>
                            <option value='' selected>Please select category</option>
                            {categories.map(category => {
                                return(
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='form-section__container__form__select-container'>
                        <label className='form-section__container__form__select-container--label form-section__container__form--label'>Session</label>
                        <select className='form-section__container__form__select-container--select form-section__container__form--select' onChange={(e) => {setPhoto({...photo, ...{session: e.target.value} as unknown as PhotoAdd})}}>
                            <option value='' selected>Please select session</option>
                            {sessions.map(session => {
                                return(
                                    <option key={session.id} value={session.id}>{session.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='form-section__container__form__date-container'>
                            <label className='form-section__container__form__date-container--label form-section__container__form--label'>Date taken</label>
                            <input className='form-section__container__form__date-container--input form-section__container__form--input' type='date' onChange={(e) => {setPhoto({...photo, ...{date_created: e.target.value} as unknown as PhotoAdd})}} defaultValue={photo.date_created} />
                        </div>
                    <div className='form-section__container__form__checkbox-container'>
                        <label className='form-section__container__form__checkbox-container--label form-section__container__form--label'>Main page</label>
                        <input className='form-section__container__form__checkbox-container--input form-section__container__form--input' type="checkbox" onChange={(e) => handleCheckbox(e)}/>
                    </div>

                    <SubmitButton text='Add photo' />
                </form>
            </div>
        </section>
    );
}

export default AddPhoto;