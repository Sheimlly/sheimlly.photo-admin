import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import api from "../../helpers/api";
import { UserInfo, SocialMedia, AddSocialMedia } from '../../helpers/interfaces';
import { SubmitButton } from "../../partials/buttons";

const UserInfoPage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const userInfoEmail = useRef<HTMLInputElement>(null);
    const userInfoPhoneNumber = useRef<HTMLInputElement>(null)

    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const [socialMedia, setSocialMedia] = useState<AddSocialMedia | null>();
    
    const [socialMedias, setSocialMedias] = useState<SocialMedia[] | []>([]);
    const [editUserInfo, setEditUserInfo] = useState<boolean>(false);

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        
        setSocialMedia({
            ...socialMedia,
            ...{icon: e.target.files[0]} as unknown as AddSocialMedia
        });
    }

    const addSocialMedia = (e: FormEvent) => {
        e.preventDefault();
        api.post('/api/users/socialmedia/',
            {
                name: socialMedia?.name,
                icon: socialMedia?.icon,
                username: socialMedia?.username,
                link: socialMedia?.link,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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

    return (
        <>
            <section className='container form-section my-5'>
                <div className='form-section__container user-info-form-container'>
                    <h1 className='form-section__container--title'>User info</h1>
                    {editUserInfo ? 
                        <form className='form-section__container__form' onSubmit={(e) => updateUserInfo(e)}>
                            <input className='form-section__container__form--input' type="email" ref={userInfoEmail} placeholder="Email" required/>
                            <input className='form-section__container__form--input' type="number" ref={userInfoPhoneNumber} placeholder="Phone number" required/>
                            <div className='d-flex justify-content-between align-items-center'>
                                <SubmitButton text='Update' />
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

                <div className='form-section__container user-info-form-container'>
                    <h2 className='form-section__container--title'>Add social media</h2>
                    <form className='form-section__container__form' onSubmit={(e) => addSocialMedia(e)}>
                        <input className='form-section__container__form--input' type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{name: e.target.value} as unknown as AddSocialMedia})} placeholder="Name" name="name" value={socialMedia?.name} required/>
                        <div className='form-section__container__form__file-container'>
                            <label className='form-section__container__form__file-container--label form-section__container__form--label'>Image</label>
                            <input className='form-section__container__form__file-container--input form-section__container__form--input' type="file" accept="image/png, image/jpeg, image/svg" onChange={(e) => {handleFileChange(e)}} required />
                        </div>
                        <input className='form-section__container__form--input' type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{username: e.target.value} as unknown as AddSocialMedia})} placeholder="Username" name="username" value={socialMedia?.username} required/>
                        <input className='form-section__container__form--input' type="text" onChange={(e) => setSocialMedia({...socialMedia, ...{link: e.target.value} as unknown as AddSocialMedia})} placeholder="Link" name="link" value={socialMedia?.link} required/>
                        <SubmitButton text='Add' />
                    </form>
                </div>
            </section>

            <section className='socials-section container my-5'>
                <h3 className='socials-section--title'>Social Medias</h3>
                <div className='row socials-section__container'>
                    {socialMedias.map((social) => {
                        return (
                            <div key={social.id} className='socials-section__container__social col-3 mx-1 my-5'>
                                <img className='socials-section__container__social--icon' src={social.icon} />
                                <div className='socials-section__container__social--info'>
                                    <strong>Name</strong>
                                    <p>{social.name}</p>
                                </div>
                                <div className='socials-section__container__social--info'>
                                    <strong>Username</strong>
                                    <a href={social.link}>{social.username}</a>
                                </div>
                                <p className='socials-section__container__social--button delete-button' onClick={() => handleSocialMediaDelete(social.id)}>Delete</p>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    );
}

export default UserInfoPage;