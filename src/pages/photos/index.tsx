import { useState, useEffect, useRef } from "react";
import api from "../../helpers/api";
import { Photos } from '../../helpers/interfaces';

const PhotosPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [photos, SetPhotos] = useState<Photos[] | []>([]);

    const handleDelete = (id: number) => {
        api.delete(`/api/photos/${id}/`);
        window.location.reload();
    }

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await api.get('/api/photos/');
                SetPhotos(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchPhotos();
    }, []);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Photos</h1>
            </section>

            <section className="photos container">
                <div className="photos__filters">

                </div>
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
                                    {/* <button onClick={() => handleRemoveFromMainPage(photo.id)}>Remove from main page</button> */}
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