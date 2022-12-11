import data from "bootstrap/js/src/dom/data";

export default function useGetJWT() {

    return function (username, password) {

        return fetch('http://localhost:8245/api/login_check', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password})
        })
            .then(data => data.json())
    }
}