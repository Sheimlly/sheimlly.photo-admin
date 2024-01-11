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
                        <a href='/sessions/add' className='filters-section__container__filters--button'>Add Session</a>
                    </div>
                </div>
            </section>

            <section className="session-section container my-5">
                <div className="session-section__container row">
                    {sessions.map((session) => {
                        return (
                            <div key={session.id} className="session-section__container__session col-12 my-3">
                                <img className="session-section__container__session--image" src={session.image} />
                                <div className="session-section__container__session__text-container">
                                    <p className="session-section__container__session__text-container--name">Name</p>
                                    <p className="session-section__container__session__text-container--value">{session.name}</p>
                                </div>
                                <div className="session-section__container__session__text-container">
                                    <p className="session-section__container__session__text-container--name">Name_pl</p>
                                    <p className="session-section__container__session__text-container--value">{session.name_pl}</p>
                                </div>
                                <div className="session-section__container__session__text-container">
                                    <p className="session-section__container__session__text-container--name">Date taken</p>
                                    <p className="session-section__container__session__text-container--value">{session.date_taken}</p>
                                </div>
                                <div className="session-section__container__session__buttons-container">
                                    <a className="session-section__container__session__buttons-container--edit" href={`/sessions/${session.id}`}>Edit</a>
                                    <p className="session-section__container__session__buttons-container--delete delete-button" onClick={() => handleDelete(session.id)}>Delete with all photos</p>
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