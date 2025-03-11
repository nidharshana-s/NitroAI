import './newprompt.css';
import arrow from '../../public/arrow.png';
import React, { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini';
const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = React.memo(({ data }) => {
  const endref = useRef(null);
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [img, setImg] = useState({
    isLoading: false,
    error: '',
    dbdata: {},
    aidata: {},
  });

  const chat = model.startChat({
    history: data?.history
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0]?.text || '' }],
        }))
      : [],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endref.current.scrollIntoView({ behavior: 'smooth' });
  }, [data, question, answer, img.dbdata]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question?.length ? question : undefined,
          answer,
          img: img.dbdata?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', data._id] }).then(() => {
        formRef.current.reset();
        setQuestion('');
        setAnswer('');
        setImg({
          isLoading: false,
          error: '',
          dbdata: {},
          aidata: {},
        });
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    console.log('add function called with:', text);
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aidata).length ? [img.aidata, text] : [text]
      );
      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        //console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = e.target.input.value;
    if (!userInput) return;
    add(userInput, false);
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

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

      {!data?.history?.some(msg => msg.parts[0].text === question) && question && <div className="message user">{question}</div>}
      {!data?.history?.some(msg => msg.parts[0].text === answer) && answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endChat" ref={endref}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />

        <input id="file" type="file" multiple={false} hidden />
        <input type="text" placeholder="Ask Anything" name="input" />
        <button>
          <img src={arrow} />
        </button>
      </form>
    </>
  );
});

export default NewPrompt;