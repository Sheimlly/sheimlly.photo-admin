import { useState, useEffect, FormEvent } from "react";
import api from "../../helpers/api";
import { UserInfo, SocialMedia } from '../../helpers/interfaces';

const UserInfoPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [socialMedia, setSocialMedia] = useState<SocialMedia | null>();
    const [socialMedias, setSocialMedias] = useState<SocialMedia[] | []>([]);
    const [editUserInfo, setEditUserInfo] = useState(false);

    // const handleDelete = async (id: number) => {
    //     await api.delete(`/api/photos/${id}/`);
    //     window.location.reload();
    // }


    const updateUserInfo = (e: FormEvent) => {
        e.preventDefault();
        if(userInfo?.id) {
            api.put(`/api/users/userinfo/${userInfo.id}/`,
                {
                    email: userInfo.email,
                    phone_number: userInfo.phone_number
                }
            )
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
        }
        else {
            api.post('/api/users/userinfo/',
                {
                    email: userInfo?.email,
                    phone_number: userInfo?.phone_number
                }
            )
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
            <section className="site_header container my-5">
                <h1 className="site_header-title">User info</h1>
            </section>

            <section className="userinfo container">
                <div className="userinfo_info row my-5">
                    {editUserInfo ? 
                        <form onSubmit={(e) => updateUserInfo(e)}>
                            <input className="mb-2" type="email" onChange={(e) => setUserInfo({...userInfo, ...{email: e.target.value} as unknown as UserInfo})} placeholder="Email" value={userInfo?.email} required/><br />
                            <input type="number" onChange={(e) => setUserInfo({...userInfo, ...{phone_number: e.target.value} as unknown as UserInfo})} placeholder="PhoneNumber" value={userInfo?.phone_number}/><br />
                            <input className="mt-2" type="submit" value='update' />
                        </form>
                        :
                        <div>
                            <p>Email: <span>{userInfo?.email}</span></p>
                            <p>Phone Number: <span>{userInfo?.phone_number}</span></p>
                            <button onClick={() => setEditUserInfo(true)}>Edit</button>
                        </div>
                    }
                </div>
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
                    <div className="col-6 userinfo_socialmedia__add d-flex flex-column align-items-center">
                        <h3>Add social media</h3>
                        <form onSubmit={(e) => addSocialMedia(e)}>
                            <input className="my-2" type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{name: e.target.value} as unknown as SocialMedia})} placeholder="Name" name="name" value={socialMedia?.name} required/><br />
                            <input className="my-2" type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{username: e.target.value} as unknown as SocialMedia})} placeholder="Username" name="username" value={socialMedia?.username} required/><br />
                            <input className="my-2" type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{link: e.target.value} as unknown as SocialMedia})} placeholder="Link" name="link" value={socialMedia?.link} required/><br />
                            <input className="mt-2" type="submit" value="Add" />
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default UserInfoPage;