import './Chatpage.css';
import NewPrompt from '../../components/newprompt/NewPrompt';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const Chatpage = () => {
    const path = useLocation().pathname;
    const chatId = path.split("/").pop();

    const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
    });

    console.log(data);
    // useEffect(() => {
    //     if(data){

    //         console.log(data)
    //     }
        
    // }, [data]);

    return (
        <div className="chatpage">
            <div className="wrapper">
                <div className="chat">
                    {isPending 
                    ? "isLoadingggg" 
                    : error 
                    ? console.log(error)
                    : data?.history?.map((message, i) => (
                            <>
                                {message.img && (
                                    <IKImage
                                        urlEndpoint={import.meta.env.VITE_IMAGEIO_BASE_URL}
                                        path={message.img}
                                        height='300'
                                        width='400'
                                        transformation={[{height:300, width:400}]}
                                        loading="lazy"
                                        lqip={{active:true, quality: 20}}

                                    />
                                )}
                                <div className={message.role === "user" ? "message user" : "message"} key={i}>
                                    <Markdown>{message.parts[0].text}</Markdown>
                                </div>
                            </>
                        ))}
                    
                    {/* <NewPrompt /> */}
                    {data && <NewPrompt data={data}/>}

                </div>
            </div>
        </div>
    );
}
export default Chatpage;