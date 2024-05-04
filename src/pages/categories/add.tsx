import { FormEvent, useEffect, useRef} from 'react';
import { CategoryAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";
import { SubmitButton } from '../../partials/buttons';

const AddCategory = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    const categoryName = useRef<HTMLInputElement>(null)
    const categoryNamePl = useRef<HTMLInputElement>(null)

    const addCategory = async (e: FormEvent) => {
        e.preventDefault();

        const data : CategoryAdd = {
            name: categoryName.current?.value,
            name_pl: categoryNamePl.current?.value,
        }

        await api.post('/api/photos/categories/', data);
        window.location.href = '/categories';
    }

    useEffect(() => {
        document.title = 'Add category';
    }, [])

    return (
        <section className='container form-section'>
            <div className='form-section__container'>
                <h1 className="form-section__container--title">Add Category</h1>

                <form className='form-section__container__form' onSubmit={(e) => addCategory(e)}>
                    <input className='form-section__container__form--input' type="text" ref={categoryName} placeholder='Category name' required />
                    <input className='form-section__container__form--input' type="text" ref={categoryNamePl} placeholder='Category name pl' required />
                    <SubmitButton text='Add category' />
                </form>
            </div>
        </section>
    )
}

export default AddCategory;