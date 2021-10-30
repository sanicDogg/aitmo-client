import './Input.css';

export const Input = (props) => {
    let { message, setMessage, sendMessage } = props;

    return (
        <div className={"input"}>
            <input
                className={"input__element"}
                placeholder={"Write a message..."}
                value={message}
                onChange={
                    (e => {
                        setMessage(e.target.value);
                    })
                }
                onKeyDown={
                    (e) => {
                        if (e.key === "Enter") sendMessage();
                    }
                }/>
        </div>
    )
}
