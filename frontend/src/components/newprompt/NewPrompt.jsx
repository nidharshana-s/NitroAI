import './newprompt.css';
import arrow from '../../public/arrow.png';
import React, { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import { createChatStream } from '../../lib/groq';
const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MODEL = 'llama-3.3-70b-versatile';

function historyToMessages(history) {
  return history.map(({ role, parts }) => ({
    role: role === 'model' ? 'assistant' : 'user',
    content: parts[0]?.text || '',
  }));
}

const NewPrompt = React.memo(({ data }) => {
  const endref = useRef(null);
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [error, setError] = useState('');
  const [img, setImg] = useState({
    isLoading: false,
    error: '',
    dbdata: {},
    aidata: {},
  });

  const conversationHistoryRef = useRef(
    data?.history ? historyToMessages(data.history) : []
  );
  const formRef = useRef(null);

  useEffect(() => {
    conversationHistoryRef.current = data?.history
      ? historyToMessages(data.history)
      : [];
  }, [data?.history]);

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
    if (!isInitial) setQuestion(text);
    setError('');

    try {
      const userMessage = { role: 'user', content: text };
      const messages = isInitial && conversationHistoryRef.current.length
        ? conversationHistoryRef.current
        : [...conversationHistoryRef.current, userMessage];

      const stream = createChatStream({ model: MODEL, messages });

      let accumulatedText = '';
      for await (const chunk of stream) {
        accumulatedText += chunk;
        setAnswer(accumulatedText);
      }

      if (!accumulatedText) {
        throw new Error('No response received from the model.');
      }

      const assistantMessage = { role: 'assistant', content: accumulatedText };

      if (isInitial) {
        conversationHistoryRef.current.push(assistantMessage);
      } else {
        conversationHistoryRef.current.push(userMessage, assistantMessage);
      }

      mutation.mutate();
    } catch (err) {
      setError(err.message || 'Failed to get a response. Please try again.');
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
      {error && <div className="message">{error}</div>}

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