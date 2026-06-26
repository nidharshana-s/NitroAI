import { IKContext, IKUpload } from 'imagekitio-react';
import attach from "../../public/attachment.png";
import { useRef } from 'react';

const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;
const publicKey = import.meta.env.VITE_IMAGEIO_PUBLIC_KEY;
const authenticator =  async () => {
    try {
        const response = await fetch('http://localhost:3000/api/upload');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const Upload = ({setImg}) => {
    const ikUploadRef = useRef(null)
    const onError = err => {
        console.log("Error", err);
      };

      const onSuccess = res => {
        console.log("Success", res);
        setImg((prev) => ({
            ...prev, isLoading:false, dbdata:res
        }))
      };

      const onUploadProgress = progress => {
        console.log("Progress", progress);
      };

    const onUploadStart = (evt) => {
        const file = evt.target.files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
          setImg((prev) => ({
            ...prev,
            isLoading: true,
            aidata: {
              inlineData: {
                data: reader.result.split(",")[1],
                mimeType: file.type,
              },
            },
          }));
        };
        reader.readAsDataURL(file);
      };

    return (
        <IKContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                fileName="test-upload.png"
                useUniqueFileName={true}
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                onUploadStart={onUploadStart}
                style={{ display: "none" }}
                ref={ikUploadRef}
            />
            <label onClick={() => ikUploadRef.current.click()} className="icon-btn cursor-pointer">
                <img src={attach} alt="Attach file" />
            </label>
        </IKContext>
    )
}

export default Upload;
