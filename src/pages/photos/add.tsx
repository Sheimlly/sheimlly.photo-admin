import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Categories, Sessions, PhotoAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";

const AddPhoto = () => {
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [sessions, setSessions] = useState<Sessions[] | []>([]);

    const [photo, setPhoto] = useState<PhotoAdd>({
        image: undefined,
        category: undefined,
        session: undefined,
        date_created: undefined,
        main_page: false,
    });

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
        setPhoto({
            ...photo,
            ...{image: e.target.files[0]} as unknown as PhotoAdd
        });
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
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Add photo</h1>
            </section>
            <section className='container edit-form'>
                <form onSubmit={(e) => addPhoto(e)}>
                    <div>
                        <label>Image</label>
                        <input type='file' onChange={(e) => {handleFileChange(e)}} required />
                    </div>
                    <div className="">
                        <label>Category:</label>
                        <select onChange={(e) => {setPhoto({...photo, ...{category: e.target.value} as unknown as PhotoAdd})}}>
                            {categories.map(category => {
                                return(
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="">
                        <label>Session:</label>
                        <select onChange={(e) => {setPhoto({...photo, ...{session: e.target.value} as unknown as PhotoAdd})}}>
                            <option value='None'>None</option>
                            {sessions.map(session => {
                                return(
                                    <option key={session.id} value={session.id}>{session.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="">
                        <label>Date created:</label>
                        <input type="date" onChange={(e) => {setPhoto({...photo, ...{date_created: e.target.value} as unknown as PhotoAdd})}} defaultValue={photo.date_created} />
                    </div>
                    <div className="">
                        <label>Main page:</label>
                        <input type="checkbox" onChange={(e) => handleCheckbox(e)} checked={photo.main_page ? true : false} />
                    </div>

                    <input className="submit" type="submit" value='Add' />
                </form>
            </section>
        </>
    );
}

export default AddPhoto;