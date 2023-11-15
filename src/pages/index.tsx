import { useState, useEffect } from "react";
import api from "../helpers/api";
import { Photos } from '../helpers/interfaces';

const HomePage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [photos, setPhotos] = useState<Photos[] | []>([]);

    const handleDelete = async (id: number) => {
        await api.delete(`/api/photos/${id}/`);
        window.location.reload();
    }

    const handleRemoveFromMainPage = async (id: number) => {
        await api.patch(`/api/photos/${id}/`, {main_page: false});
        window.location.reload();
    }

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await api.get('/api/photos/', {
                    params: {
                        main_page: true
                    }
                });
                setPhotos(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchPhotos();
    }, []);

    return (
        <>
            <section className="homepage__header site_header container my-5">
                <h1 className="homepage__header site_header-title">Homepage</h1>
            </section>

            <section className="container photos">
                <div className="photos__container">
                    {photos.map((photo) => {
                        return (
                            <div key={photo.id} className="photos__container--photo d-flex justify-content-between my-3">
                                <img src={photo.image} />
                                <div className="mx-5">
                                    <p>Category</p>
                                    <p>{photo.category_name}</p>
                                </div>
                                <div className="mx-5">
                                    <p>Session</p>
                                    <p>{photo.session_name ? photo.session_name : '-'}</p>
                                </div>
                                <div className="mx-5">
                                    <p>Main page</p>
                                    <p>{photo.main_page ? 'True' : 'False'}</p>
                                </div>
                                <div className="mx-5">
                                    <button><a href={`/photos/${photo.id}`}>Edit</a></button>
                                    <button onClick={() => handleDelete(photo.id)}>Delete</button>
                                    <button onClick={() => handleRemoveFromMainPage(photo.id)}>Remove from main page</button>
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