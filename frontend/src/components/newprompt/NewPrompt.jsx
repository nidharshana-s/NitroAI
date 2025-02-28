import './newprompt.css'
import arrow from "../../public/arrow.png";
import { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;


const NewPrompt = () => {
    const endref = useRef(null);

    useEffect(() =>{
        endref.current.scrollIntoView({behavior:"smooth"});
    },[])

    const [img, setImg] = useState({
        isLoading:false,
        dbdata:{}
    })

    const add = async () => {
        const prompt = "Explain how AI works";
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    }
    
    return (
        <>
        <button onClick={add}> TEST AI </button>
        {img.isLoading && <div> is Loading.......</div>}
        {img.dbdata?.filePath && (
            <IKImage
            urlEndpoint={urlEndpoint} 
            path={img.dbdata?.filePath}
            width="200"
            />
        )}
        
        <div className="endChat" ref={endref}></div>
        <form className='newForm'>
            <Upload setImg={setImg} />
                
            <input id='file' type="file" multiple={false} hidden />
            <input type="text" placeholder='Ask Anything' />
            <button>
                <img src={arrow} />
            </button>
        </form>
        </>
    )
}

export default NewPrompt