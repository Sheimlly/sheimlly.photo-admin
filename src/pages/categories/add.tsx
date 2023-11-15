import { FormEvent, useEffect, useState} from 'react';
import { CategoryAdd } from '../../helpers/interfaces';
import api from "../../helpers/api";

const AddCategory = () => {
    const [category, setCategory] = useState<CategoryAdd>({
        name: undefined,
        name_pl: undefined
    });

    const addCategory = async (e: FormEvent) => {
        e.preventDefault();
        await api.post('/api/photos/categories/', category);
        window.location.href = '/categories';
    }

    useEffect(() => {
        document.title = 'Add category';
    }, [])

    return (
        <>
            <section className="site_header container my-5">
                <h1 className="site_header-title">Add Category</h1>
            </section>

            <section className="container edit-form">
                <form onSubmit={(e) => addCategory(e)}>
                    <div>
                        <label>Name</label>
                        <input type="text" value={category.name} onChange={(e) => {setCategory({...category, ...{name: e.target.value} as unknown as CategoryAdd})}} required />
                    </div>
                    <div>
                        <label>Name_pl</label>
                        <input type="text" value={category.name_pl} onChange={(e) => {setCategory({...category, ...{name_pl: e.target.value} as unknown as CategoryAdd})}} required />
                    </div>
                    <input className="submit" type="submit" value='Add' />
                </form>
            </section>
        </>
    )
}

export default AddCategory;