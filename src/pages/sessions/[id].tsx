import { useState, useEffect, FormEvent } from "react";
import { useParams } from 'react-router-dom';
import api from "../../helpers/api";
import { Sessions } from "../../helpers/interfaces";
import { SubmitButton } from "../../partials/buttons";

const EditCategory = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }
    
    const { id } = useParams();

    const [session, setSession] = useState<Sessions>();

    const handleDelete = async () => {
        await api.delete(`/api/photos/sessions/${id}/`);
        window.location.href = '/categories';
    }

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        await api.patch(`/api/photos/sessions/${id}/`, session);
        window.location.href = '/sessions';
    }

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/api/photos/sessions/${id}/`);
                setSession(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        document.title = 'Edit session';

        fetchCategory();
    }, []);

    return (
        <section className="form-section container my-5">
            <div className="form-section__container">
                <h1 className="form-section__container--title">Edit session</h1>

                <form className="form-section__container__form" onSubmit={(e) => handleUpdate(e)}>
                    <label className="form-section__container__form--label">Name</label>
                    <input className="form-section__container__form--input" type="text" value={session?.name} onChange={(e) => {setSession({...session, ...{name: e.target.value} as unknown as Sessions})}} />
                
                    <label className="form-section__container__form--label">Name_pl</label>
                    <input className="form-section__container__form--input" type="text" value={session?.name_pl} onChange={(e) => {setSession({...session, ...{name_pl: e.target.value} as unknown as Sessions})}} />

                    <label className="form-section__container__form--label">Date taken</label>
                    <input className="form-section__container__form--input" type="date" defaultValue={session?.date_taken} onChange={(e) => {setSession({...session, ...{date_taken: e.target.value} as unknown as Sessions})}} />

                    <SubmitButton text='Update' />
                </form>

                <p className='delete-button mt-3' onClick={handleDelete}>Delete with all photos</p>
            </div>
        </section>
    );
}

export default EditCategory;