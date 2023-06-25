const APIURL = 'http://localhost:3000/api';


async function login(username, password) {
    try {
        const response = await fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        if (response.ok) {
            return await response.json();
        } else {
            const e = await response.json();
            throw new Error( e.error.message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getPages() {
    try {
        const response = await fetch(APIURL + '/pages');
        if (response.ok) {
            const pages = await response.json();
            return pages;
        } else {
            // if response is not OK
            const error = await response.json();
            throw new Error(response.statusText + " " + error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function logout() {
    try {
        const response = await fetch(APIURL + '/logout', {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
            const message = await response.json();
            return  message;
        } else {
            const error = await response.text();
            throw new Error(response.statusText + " " + error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getPageWithBlocks(pageId) {
    try {
        const response = await fetch(APIURL + `/pages/${pageId}`);
        if (response.ok) {
            const completePage = await response.json();
            return completePage;
        } 
        else {
            // if response is not OK
            const error = await response.json();
            throw new Error(response.statusText + " " + error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getWebsiteName() {
    try {
        const response = await fetch(APIURL + '/websiteName');
        if (response.ok) {
            const name = await response.json();
            return name;
        } else {
            const error = await response.json();
            throw new Error(response.statusText + " " + error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function deletePage(pageId){
    try {
        const response = await fetch(APIURL + `/pages/${pageId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            return {};
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function updateWebsiteName(newName) {
    try {
        const response = await fetch(APIURL + '/websiteName', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newName
            })
        });

        if (response.ok) {
            return {};
        } else {
            const error = await response.json();
            throw new Error(response.statusText + " " + error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function createPage(page){
    try{
        const response = await fetch(APIURL + '/pages', {
            method: 'POST',
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        });
        if(response.ok){
            const page = await response.json();
            return page;
        }
        else{
            const error = await response.json();
            throw new Error(response.statusText + " " + error);
        }
    }catch(error){
        throw new Error(error.message, { cause: error });
    }
}

async function findUser(username) {
    try {
        const response = await fetch(APIURL + `/admin/user/${username}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            // if response is not OK
            const e = await response.json();
            throw new Error(e.error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function changeAuthor(pageId, username){
    try {
        const response = await fetch(APIURL + `/admin/${pageId}/updateAuthor`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: username
            })
        });

        if (response.ok) {
            return {};
        } else {
            const e = await response.json();
            throw new Error(e.error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function editPage(pageId, page){
    try {
        const response = await fetch(APIURL + `/pages/${pageId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        });

        if (response.ok) {
            return {};
        } else {
            const e = await response.json();
            throw new Error(e.error);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

export { getPages, login, getPageWithBlocks, logout, getWebsiteName, deletePage, updateWebsiteName, createPage, findUser, changeAuthor, editPage};