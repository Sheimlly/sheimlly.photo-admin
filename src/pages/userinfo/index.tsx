import { useState, useEffect, useRef, FormEvent } from "react";
import api from "../../helpers/api";
import { UserInfo, SocialMedia } from '../../helpers/interfaces';

const UserInfoPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const userInfoEmail = useRef<HTMLInputElement>(null);
    const userInfoPhoneNumber = useRef<HTMLInputElement>(null)

    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [socialMedia, setSocialMedia] = useState<SocialMedia | null>();
    const [socialMedias, setSocialMedias] = useState<SocialMedia[] | []>([]);
    const [editUserInfo, setEditUserInfo] = useState<boolean>(false);

    // const handleDelete = async (id: number) => {
    //     await api.delete(`/api/photos/${id}/`);
    //     window.location.reload();
    // }


    const updateUserInfo = (e: FormEvent) => {
        e.preventDefault();

        const data : UserInfo = {
            email: userInfoEmail.current?.value,
            phone_number: userInfoPhoneNumber.current?.value
        }

        if(userInfo?.id) {
            api.put(`/api/users/userinfo/${userInfo.id}/`, data)
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
        }
        else {
            api.post('/api/users/userinfo/', data)
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    const addSocialMedia = (e: FormEvent) => {
        e.preventDefault();
        api.post('/api/users/socialmedia/',
            {
                name: socialMedia?.name,
                username: socialMedia?.username,
                link: socialMedia?.link,
            }
        )
        .then(() => {
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleSocialMediaDelete = (id: number) => {
        api.delete(`/api/users/socialmedia/${id}/`)
        .then(() => {window.location.reload();})
        .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/api/users/userinfo/');
                setUserInfo(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        const fetchSocialMedia = async () => {
            try {
                const response = await api.get('/api/users/socialmedia/');
                setSocialMedias(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        document.title = 'User Info';

        fetchUserInfo();
        fetchSocialMedia();
    }, []);

    // useEffect(() => {
    //     fetchPhotos();
    // }, [filters]);

    return (
        <>
            <section className='container form-section'>
                <div className='form-section__container'>
                    <h1 className='form-section__container--title'>User info</h1>
                    {editUserInfo ? 
                        <form className='form-section__container__form' onSubmit={(e) => updateUserInfo(e)}>
                            <input className='form-section__container__form--input' type="email" ref={userInfoEmail} placeholder="Email" required/>
                            <input className='form-section__container__form--input' type="number" ref={userInfoPhoneNumber} placeholder="Phone number" required/>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='form-section__container__form__submit-container'>
                                    <input className='form-section__container__form__submit-container--button' type='submit' value='Update' />
                                    <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                            <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                        </svg>
                                    </span>
                                </div>
                                <span className='form-section__container__form__submit-container--cancel' onClick={() => setEditUserInfo(false)}>Cancel</span>
                            </div>
                        </form>
                        :
                        <div className='form-section__container__info'>
                            <p>Email: <span>{userInfo?.email}</span></p>
                            <p>Phone Number: <span>{userInfo?.phone_number}</span></p>
                            <button className='form-section__container__info--button' onClick={() => setEditUserInfo(true)}>Edit</button>
                        </div>
                    }
                </div>

                <div className='form-section__container'>
                    <h2 className='form-section__container--title'>Add social media</h2>
                    <form className='form-section__container__form' onSubmit={(e) => addSocialMedia(e)}>
                        <input className='form-section__container__form--input' type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{name: e.target.value} as unknown as SocialMedia})} placeholder="Name" name="name" value={socialMedia?.name} required/><br />
                        <input className='form-section__container__form--input' type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{username: e.target.value} as unknown as SocialMedia})} placeholder="Username" name="username" value={socialMedia?.username} required/><br />
                        <input className='form-section__container__form--input' type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{link: e.target.value} as unknown as SocialMedia})} placeholder="Link" name="link" value={socialMedia?.link} required/><br />
                        <div className='form-section__container__form__submit-container'>
                            <input className='form-section__container__form__submit-container--button' type='submit' value='Add' />
                            <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                    <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
            </section>

            <section>
                <div className="row">
                    <div className="col-6 userinfo_socialmedia__container">
                        {socialMedias.map((social) => {
                            return (
                                <div key={social.id} className="userinfo_socialmedia__container--single row align-items-center my-3">
                                    <div className="col-3">
                                        <strong>Name</strong>
                                        <p>{social.name}</p>
                                    </div>
                                    <div className="col-3">
                                        <strong>Username</strong>
                                        <p>{social.username}</p>
                                    </div>
                                    <div className="col-3">
                                        <strong>Link</strong>
                                        <p>{social.link}</p>
                                    </div>

                                    <div className="col-3 d-flex justify-content-center">
                                        <button onClick={() => handleSocialMediaDelete(social.id)}>Delete</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

export default UserInfoPage;