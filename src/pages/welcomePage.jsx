import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import CreatorView from "../views/creator.view.jsx";
import FollowerView from "../views/follower.view.jsx";

function WelcomePage(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect( () =>{

        fetch('http://localhost:3000/auth/me', {
            credentials: 'include'
        })
            .then((response) =>{

                if(response.ok) return response.json();
                navigate('/');

            }).then((parsedResponse) =>{

                setUser(parsedResponse.me); //gatillamos render;
                setLoading(false);

            }).catch(() =>{
                navigate('/');
            })
    },[]);

    if(loading) return(<p>Cargando ...</p>)

    return(
        <>
            {user.role === 'creador' ? <CreatorView user={user}/> : null}
            {user.role === 'seguidor' ? <FollowerView user={user}/> : null}
        </>
    );
}

export default WelcomePage;