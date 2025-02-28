import './newprompt.css'
import arrow from "../../public/arrow.png";
import { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;
import Markdown from 'react-markdown'

const NewPrompt = () => {
    const endref = useRef(null);
    
    const [question, setQuestion] = useState();
    const [answer, setAnswer] = useState();
    const [img, setImg] = useState({
        isLoading:false,
        dbdata:{},
        aidata:{}
    })

    useEffect(() =>{
        endref.current.scrollIntoView({behavior:"smooth"});
    },[question, answer, img.dbdata])

    const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });

    const add = async (userInput) => {
        setQuestion(userInput)
        const result = await chat.sendMessageStream(
            Object.entries(img.aidata).length ? [img.aidata, userInput] : [userInput]
        );
        let accText = ""
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            accText += chunkText;
            setAnswer(accText);
          }
        setImg({
            isLoading:false,
            dbdata:{},
            aidata:{}
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userInput = e.target.input.value;
        if(!userInput) return;
        add(userInput)
    }
    
    return (
        <>
        
        {img.isLoading && <div> is Loading.......</div>}
        {img.dbdata?.filePath && (
            <IKImage
            urlEndpoint={urlEndpoint} 
            path={img.dbdata?.filePath}
            width="200"
            />
        )}

        {question && <div className='message user'>{question}</div>}
        {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

        
        <div className="endChat" ref={endref}></div>
        <form className='newForm' onSubmit={handleSubmit}>
            <Upload setImg={setImg} />
                
            <input id='file' type="file" multiple={false} hidden />
            <input type="text" placeholder='Ask Anything' name="input"/>
            <button>
                <img src={arrow} />
            </button>
        </form>
        </>
    )
}

export default NewPrompt