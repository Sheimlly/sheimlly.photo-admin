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
    deletePhoto: Function
}

const PhotosList = ({photos, deletePhoto}:Props ) => {
    return (
        <>
            <div className="row">
                {photos.map((photo) => {
                    return (
                        <div className="col-3 my-3" style={{border: '1px solid gray'}}>
                            <h3 className='mb-2'>{photo.image?.name}</h3>
                            <div className="my-2">
                                <strong>Category</strong>
                                <p>{photo.category}</p>
                            </div>
                            <div>
                                <strong>Main page</strong>
                                <p>{photo.main_page ? 'True' : 'False'}</p>
                            </div>
                            <div className="mt-2">
                                <button onClick={() => deletePhoto(photo)}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
      );
}

const AddSession = () => {
    const [session, setSession] = useState<SessionAdd>({
        name: undefined,
        name_pl: undefined,
        date_taken: undefined
    });

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
        console.log(e.target.files[0]);
        setPhoto({
            ...photo,
            ...{image: e.target.files[0]} as unknown as SessionPhoto
        });
    }

    const addCategory = async (e: FormEvent) => {
        e.preventDefault();
        const response = await api.post('/api/photos/sessions/', session);

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

        fetchCategories();
    }, [])

    return (
        <>
            <section className="site_header container my-5">
                <div className='row'>
                    <h1 className="site_header-title col-6">Add Session</h1>
                    <h2 className="site_header-title col-6">Add session photos</h2>
                </div>
            </section>

            <section className="container edit-form">
                <div className='row'>
                    <form className="col-6" onSubmit={(e) => addCategory(e)}>
                        <div>
                            <label>Name</label>
                            <input type="text" onChange={(e) => {setSession({...session, ...{name: e.target.value} as unknown as SessionAdd})}} required />
                        </div>
                        <div>
                            <label>Name_pl</label>
                            <input type="text" onChange={(e) => {setSession({...session, ...{name_pl: e.target.value} as unknown as SessionAdd})}} required />
                        </div>
                        <div>
                            <label>Date taken</label>
                            <input type="date" onChange={(e) => {setSession({...session, ...{date_taken: e.target.value} as unknown as SessionAdd})}} required />
                        </div>
                        <input className="submit" type="submit" value='Add' />
                    </form>

                    <form id="addPhoto" className="col-6" ref={photoForm} onSubmit={(e) => addPhoto(e)}>
                        <div>
                            <label>Image</label>
                            <input type="file" onChange={(e) => {handleFileChange(e)}} required />
                        </div>
                        <div>
                            <label>Category</label>
                            <select onChange={(e) => {setPhoto({...photo, ...{category: e.target.value} as unknown as SessionPhoto})}} required>
                                <option value='' selected>Please select category</option>
                                {categories.map(category => {
                                    return(
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div>
                            <label>Main page</label>
                            <input type="checkbox" onChange={(e) => handleCheckbox(e)}/>
                        </div>
                        <input className="submit" type="submit" value='Add' />
                    </form>
                </div>
                <PhotosList photos={photos} deletePhoto={deletePhoto} />

            </section>
        </>
    )
}

export default AddSession;