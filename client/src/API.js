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

export { getPages, login, getPageWithBlocks, logout};