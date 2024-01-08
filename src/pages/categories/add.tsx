import { FormEvent, useEffect, useRef} from 'react';
import { CategoryAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";

const AddCategory = () => {
    // const [category, setCategory] = useState<CategoryAdd>({
    //     name: undefined,
    //     name_pl: undefined
    // });

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
                    <div className='form-section__container__form__submit-container'>
                        <input className='form-section__container__form__submit-container--button' type='submit' value='Add category' />
                        <span className='form-section__container__form__submit-container--arrow-right arrow-right'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                <path opacity="1" fill="#FFFFFF" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                            </svg>
                        </span>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddCategory;