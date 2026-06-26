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
        <div className="relative flex h-full flex-col items-center">
            <div className="scrollbar-hide flex w-full flex-1 justify-center overflow-scroll">
                <div className="flex w-[70%] flex-col gap-5 max-lg:w-full max-lg:px-4 [&_li]:my-3 [&_p]:my-3">
                    {isPending
                    ? <span className="text-text-muted">Loading...</span>
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
                                <div className={
                                    message.role === "user"
                                        ? "max-w-[85%] self-end rounded-2xl bg-brand p-3.5 text-white"
                                        : "p-3.5"
                                }>
                                    <Markdown>{message.parts[0].text}</Markdown>
                                </div>
                            </Fragment>
                        ))}

                    {pending.img?.isLoading && <div className="text-text-muted">Loading image...</div>}
                    {pending.img?.dbdata?.filePath && (
                        <IKImage
                            urlEndpoint={urlEndpoint}
                            path={pending.img.dbdata.filePath}
                            width="200"
                        />
                    )}
                    {pending.question && !historyHasText(pending.question) && (
                        <div className="max-w-[85%] self-end rounded-2xl bg-brand p-3.5 text-white">{pending.question}</div>
                    )}
                    {pending.answer && !historyHasText(pending.answer) && (
                        <div className="p-3.5">
                            <Markdown>{pending.answer}</Markdown>
                        </div>
                    )}
                    {pending.error && <div className="p-3.5 text-urgency">{pending.error}</div>}

                    <div className="pb-[100px]" ref={endRef}></div>
                    {data && <NewPrompt data={data} onPendingChange={onPendingChange} />}
                </div>
            </div>
        </div>
    );
}
export default Chatpage;
