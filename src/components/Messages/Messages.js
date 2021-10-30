import './Messages.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import {Message} from "./Message/Message";

export const Messages = (props) => {
    let messages = props.msgs;
    let name = props.username;

    const proceedMessages = () => {
        if (messages.length === 0) return [];

        let isFirstMine = messages[0].user === name;
        let f = isFirstMine ? "me" : messages[0].user;
        let arrayWithMessages =
            [<Message key={0} from={f} fromText={f} text={messages[0].text} time={messages[0].time}/>];

        for (let i = 1; i < messages.length; i++) {
            let curr = messages[i];
            let prev = messages[i - 1];

            let isMine = curr.user === name;
            let from = isMine ? "me" : curr.user;

            // Если два сообщения подряд от одного отправителя,
            // то повторно имя автора сообщения не передаем

            const fromText = curr.user === prev.user ? null : from;
            arrayWithMessages.push(
                <Message key={i} from={from} text={curr.text} fromText={fromText} time={curr.time}/>
            );
        }
        return arrayWithMessages;
    }

    return (
        <ScrollToBottom className={"messages"} initialScrollBehavior={"smooth"}>
            <div className={"messages__container"}>
                { proceedMessages().map((m) => m) }
            </div>
        </ScrollToBottom>
    )
}
