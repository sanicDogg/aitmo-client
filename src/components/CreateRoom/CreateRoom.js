import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import './CreateRoom.css';

export const CreateRoom = () => {
    return (
        <div className={"create-room__wrapper"}>
            <Link to={`/${uuid()}`} style={{textDecoration: "none"}}>
                <div className={"create-room__button"}>Create Room</div>
            </Link>
            <p>Once you clicked the button, you need to reload page</p>
        </div>
    )
}
