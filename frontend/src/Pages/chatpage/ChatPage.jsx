import './Chatpage.css';
import NewPrompt from '../../components/newprompt/NewPrompt';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState, Fragment, useCallback } from 'react';

const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;

const Chatpage = () => {
    const path = useLocation().pathname;
    const chatId = path.split("/").pop();
    const endRef = useRef(null);
    const [pending, setPending] = useState({
        question: '',
        answer: '',
        error: '',
        img: { isLoading: false, error: '', dbdata: {}, aidata: {} },
    });

    const onPendingChange = useCallback((next) => {
        setPending(next);
    }, []);

    const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
    });

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data, pending]);

    const historyHasText = (text) =>
        data?.history?.some((msg) => msg.parts[0]?.text === text);

    return (
        <div className="chatpage">
            <div className="wrapper">
                <div className="chat">
                    {isPending
                    ? "isLoadingggg"
                    : error
                    ? console.log(error)
                    : data?.history?.map((message, i) => (
                            <Fragment key={i}>
                                {message.img && (
                                    <IKImage
                                        urlEndpoint={urlEndpoint}
                                        path={message.img}
                                        height='300'
                                        width='400'
                                        transformation={[{height:300, width:400}]}
                                        loading="lazy"
                                        lqip={{active:true, quality: 20}}

                                    />
                                )}
                                <div className={message.role === "user" ? "message user" : "message"}>
                                    <Markdown>{message.parts[0].text}</Markdown>
                                </div>
                            </Fragment>
                        ))}

                    {pending.img?.isLoading && <div> is Loading.......</div>}
                    {pending.img?.dbdata?.filePath && (
                        <IKImage
                            urlEndpoint={urlEndpoint}
                            path={pending.img.dbdata.filePath}
                            width="200"
                        />
                    )}
                    {pending.question && !historyHasText(pending.question) && (
                        <div className="message user">{pending.question}</div>
                    )}
                    {pending.answer && !historyHasText(pending.answer) && (
                        <div className="message">
                            <Markdown>{pending.answer}</Markdown>
                        </div>
                    )}
                    {pending.error && <div className="message">{pending.error}</div>}

                    <div className="endChat" ref={endRef}></div>
                    {data && <NewPrompt data={data} onPendingChange={onPendingChange} />}

                </div>
            </div>
        </div>
    );
}
export default Chatpage;