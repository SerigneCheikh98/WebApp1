import { ManagePageBackOffice } from "./ManagePageBackOffice";
import { createPage, getPages } from './API'
import dayjs from 'dayjs';

function AddPageBackOffice(props) {
    const initialState = {
        title: '',
        publication_date: null,
        blocks: [
            { type: 'Header', content: '', position: 1, removable: false },
            { type: 'Paragraph', content: '', position: 2, removable: false },
        ],    
    };
    const initialSelectedImages = [];

    const handleAddPage = async (inputPage) => {
        // formate the page
        let pDate = null;
        if (inputPage.publication_date !== null) {
            pDate = dayjs(inputPage.publication_date).format('YYYY-MM-DD');
        }
        const formattedPage = {
            title: inputPage.title, publication_date: pDate,
            blocks: inputPage.blocks.map((b) => { return { type: b.type, content: b.content, position: b.position } })
        };
        await createPage(formattedPage);
        const updatedPagesList = await getPages();
        props.setPages(updatedPagesList);
    }

    return <ManagePageBackOffice initialState={initialState} initialSelectedImages={initialSelectedImages} handleAddPage={handleAddPage} action={'add'}/>
}

export { AddPageBackOffice };