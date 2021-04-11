import fetchWinstallAPI from "../../utils/fetchWinstallAPI";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.end();

    const { response, error } = await fetchWinstallAPI(req.headers.requestedpath, {
        method: req.method,
        headers: {
            'Authorization': req.headers.authorization
        },
        body: req.body,
        redirect: 'follow'
    })

    return res.send({ response, error });
}