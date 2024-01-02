import { useState, useEffect, FormEvent } from "react";
import api from "../../helpers/api";
import { UserInfo, SocialMedia } from '../../helpers/interfaces';

const UserInfoPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [socialMedia, setSocialMedia] = useState<SocialMedia[] | []>([]);
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
            .catch(err => {
                console.log(err);
            });
        }

        window.location.reload();
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
                setSocialMedia(response.data);
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

            <section className="photos container">
                <div className="filtering row my-5">
                    {editUserInfo ? 
                        <form onSubmit={(e) => updateUserInfo(e)}>
                            <input className="mb-2" type="email" onChange={(e) => setUserInfo({...userInfo, ...{email: e.target.value} as unknown as UserInfo})} placeholder="Email" value={userInfo?.email} required/>
                            <br />
                            <input className="my-2" type="number" onChange={(e) => setUserInfo({...userInfo, ...{phone_number: e.target.value} as unknown as UserInfo})} placeholder="PhoneNumber" value={userInfo?.phone_number}/>
                            <br />
                            <input className="mt-2" type="submit" />
                        </form>
                        :
                        <div>
                            <p>Email: {userInfo?.email}</p>
                            <p>Phone Number: {userInfo?.phone_number}</p>
                            <button onClick={() => setEditUserInfo(true)}>Edit</button>
                        </div>
                    }
                </div>
                <div className="photos__container">
                    {socialMedia.map((social) => {
                        return (
                            <div key={social.id} className="photos__container--photo d-flex justify-content-between my-3">
                                <div className="mx-5">
                                    <p>Name</p>
                                    <p>{social.name}</p>
                                </div>
                                <div className="mx-5">
                                    <p>Username</p>
                                    <p>{social.username}</p>
                                </div>
                                <div className="mx-5">
                                    <p>Link</p>
                                    <p>{social.link}</p>
                                </div>

                                <div className="mx-5">
                                    {/* <button className="a-button"><a href={`/photos/${social.id}`}>Edit</a></button> */}
                                    {/* <button onClick={() => handleDelete(social.id)}>Delete</button> */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    );
}

export default UserInfoPage;