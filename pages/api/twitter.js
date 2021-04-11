export default async function handler(req, res) {
    let response, error;
    
    try {
        const res = await fetch(req.headers.endpoint, {
            method: req.method,
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER}`
            }
        }); 

        if(res.status !== 200) {
            error = await res.json();
        } else{
            response = await res.json();
        }
    } catch(err){
        error = err.message;
    }

    return res.send({ response, error });
}