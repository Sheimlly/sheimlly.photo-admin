import { Sessions } from "../../helpers/interfaces";
import { useState, useEffect } from "react";
import api from "../../helpers/api";

const SessionsPage = () => {
    const [sessions, setSessions] = useState<Sessions[] | []>([]);
    const [search, setSearch] = useState<string>();

    const handleDelete = async (id: number) => {
        await api.delete(`/api/photos/sessions/${id}/`);
        window.location.reload();
    }

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/photos/sessions/', {
                params: {
                    search: search
                }
            });
            
            setSessions(response.data);

            response.data.map(async (ses: Sessions) => {
                const res = await api.get('/api/photos/', {
                    params: {
                        session: ses.id
                    }
                });
                
                if (res.data.length !== 0) {
                    const newSessions = response.data.map((s: Sessions) => {
                        if (s.id === ses.id) {
                          return {
                            ...s,
                            image: res.data[0].image
                          }
                        } else {
                          return s
                        }
                    })
                    setSessions(newSessions);
                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [search]);

    useEffect(() => {
        document.title = 'Sessions';
    })


    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Sessions</h1>
            </section>

            <section className="filters-section container">
                <div className='filters-section__container'>
                    <h3 className='filters-section--title'>Filters</h3>

                    <div className='filters-section__container__filters'>
                        <input className='filters-section__container__filters--input' onChange={(e) => { setSearch(e.target.value) }} type="text" value={search} placeholder='Name'/>
                        <button className='filters-section__container__filters--button'><a href='/sessions/add'>Add Session</a></button>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="photos__container">
                    {sessions.map((session) => {
                        return (
                            <div key={session.id} className="photos__container--photo d-flex justify-content-between my-3">
                                <img src={session.image} />
                                <div className="mx-5">
                                    <p>Name</p>
                                    <p>{session.name}</p>
                                </div>
                                <div className="mx-5">
                                    <p>Name_pl</p>
                                    <p>{session.name_pl}</p>
                                </div>
                                <div className="mx-5">
                                    <p>Date taken</p>
                                    <p>{session.date_taken}</p>
                                </div>
                                <div className="mx-5">
                                    <button className="a-button"><a href={`/sessions/${session.id}`}>Edit</a></button>
                                    <button onClick={() => handleDelete(session.id)}>Delete with all photos</button>
                                    {/* <button onClick={() => handleRemoveFromMainPage(photo.id)}>Remove from main page</button> */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}

export default SessionsPage;