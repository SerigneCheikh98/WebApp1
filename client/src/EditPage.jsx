import { ManagePageBackOffice } from "./ManagePageBackOffice";
import { editPage, getPages } from './API'
import { useLocation, useParams } from "react-router-dom";
import dayjs from 'dayjs';

function EditPageBackOffice(props) {
    const { pageId } = useParams();
    const location = useLocation();
    
    const { pageInfo, blocks } = location.state;
    const initialState = {
        title: pageInfo.title,
        publication_date: null,
        blocks: blocks.map((b, index) => {
            let removable = true;
            // Set 2 not removable blocks
            if (b.type === 'Header') {
                const isFirstHeader = blocks.findIndex((block, i) => block.type === 'Header' && i < index) === -1;
                removable = isFirstHeader ? false : true;
            } else if (b.type === 'Image' || b.type === 'Paragraph') {
                const isFirstImageOrParagraph = blocks.findIndex((block, i) => (block.type === 'Image' || block.type === 'Paragraph') && i < index) === -1;
                removable = isFirstImageOrParagraph ? false : true;
            }

            return {id: b.id, type: b.type, content: b.content, position: b.position, removable:removable}
        })    
    };
    
    //const initialSelectedImages = blocks.filter((b) => b.type === 'Image').map((b) => b.content);
    const initialSelectedImages = [];
    const handleEditPage = async (inputPage) => {
        //prepare datas
        let pDate = null;
        if (inputPage.publication_date) {
            pDate = dayjs(inputPage.publication_date).format('YYYY-MM-DD');
        }
        const addBlocks = inputPage.blocks.filter((b) => { return !b.id })
                .map((block) => {
                    return {type: block.type, content: block.content, position: block.position}
                });
        const deleteBlocks = blocks.filter((b) => {return !inputPage.blocks.some(inputBlock => inputBlock.id === b.id)})
                .map((block) => {
                    return { id: block.id }
                });
        const updateBlocks = inputPage.blocks.filter((b) => {return b.id})
                .map((block) => {
                    return {id: block.id, type: block.type, content: block.content, position: block.position}
                });
        const formattedPage = {
            title: inputPage.title, publication_date: pDate,
            updateBlocks: updateBlocks,
            deleteBlocks: deleteBlocks,
            addBlocks: addBlocks
        };
        await editPage(pageId, formattedPage);
        const updatedPagesList = await getPages();
        props.setPages(updatedPagesList);
    }

    return <ManagePageBackOffice initialState={initialState} initialSelectedImages={initialSelectedImages} handleEditPage={handleEditPage} action={'edit'}/>
}

export { EditPageBackOffice };