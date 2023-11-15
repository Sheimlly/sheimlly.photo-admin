import { useState, useEffect, FormEvent } from "react";
import { useParams } from 'react-router-dom';
import api from "../../helpers/api";
import { Sessions } from "../../helpers/interfaces";

const EditCategory = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

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

        fetchCategory();
    }, []);

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Edit session</h1>
            </section>

            <section className="container edit-form">
                <form onSubmit={(e) => handleUpdate(e)}>
                    <div>
                        <label>Name</label>
                        <input type="text" value={session?.name} onChange={(e) => {setSession({...session, ...{name: e.target.value} as unknown as Sessions})}} />
                    </div>

                    <div>
                        <label>Name_pl</label>
                        <input type="text" value={session?.name_pl} onChange={(e) => {setSession({...session, ...{name_pl: e.target.value} as unknown as Sessions})}} />
                    </div>

                    <div>
                        <label>Name_pl</label>
                        <input type="date" defaultValue={session?.date_taken} onChange={(e) => {setSession({...session, ...{date_taken: e.target.value} as unknown as Sessions})}} />
                    </div>

                    <input className="submit" type="submit" value='Update' />
                </form>

                <div className="mt-5">
                    <button onClick={handleDelete}>Delete with all photos</button>
                </div>
            </section>
        </>
    );
}

export default EditCategory;