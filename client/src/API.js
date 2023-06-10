const APIURL = 'http://localhost:3000';

async function getGuess() {

    try {
        const response = await fetch(APIURL + '/guess');
        if (response.ok)
        {
            const n = await response.text() ;
            return Number(n) ;
        } else 
            throw new Error() ;
    } catch(e) {
        throw new Error(e) ;
    }


}

export { getGuess };