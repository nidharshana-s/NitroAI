import './newprompt.css';
import arrow from '../../public/arrow.png';
import React, { useEffect, useRef, useState } from 'react';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import { createInteractionStream } from '../../lib/gemini';
const urlEndpoint = import.meta.env.VITE_IMAGEIO_BASE_URL;
import Markdown from 'react-markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MODEL = 'gemini-3.5-flash';

function historyToSteps(history) {
  return history.flatMap(({ role, parts }) => {
    const content = [{ type: 'text', text: parts[0]?.text || '' }];
    if (role === 'user') return [{ type: 'user_input', content }];
    if (role === 'model') return [{ type: 'model_output', content }];
    return [];
  });
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
    data?.history ? historyToSteps(data.history) : []
  );
  const formRef = useRef(null);

  useEffect(() => {
    conversationHistoryRef.current = data?.history
      ? historyToSteps(data.history)
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
      const content = Object.entries(img.aidata).length
        ? [
            {
              type: 'image',
              mime_type: img.aidata.inlineData.mimeType,
              data: img.aidata.inlineData.data,
            },
            { type: 'text', text },
          ]
        : [{ type: 'text', text }];

      const userStep = { type: 'user_input', content };
      const input = isInitial && conversationHistoryRef.current.length
        ? conversationHistoryRef.current
        : [...conversationHistoryRef.current, userStep];

      const stream = createInteractionStream({
        model: MODEL,
        store: false,
        input,
      });

      let accumulatedText = '';
      for await (const event of stream) {
        if (
          event.event_type === 'step.delta' &&
          event.delta?.type === 'text' &&
          event.delta.text
        ) {
          accumulatedText += event.delta.text;
          setAnswer(accumulatedText);
        }
      }

      if (!accumulatedText) {
        throw new Error('No response received from the model.');
      }

      if (isInitial) {
        conversationHistoryRef.current.push({
          type: 'model_output',
          content: [{ type: 'text', text: accumulatedText }],
        });
      } else {
        conversationHistoryRef.current.push(userStep, {
          type: 'model_output',
          content: [{ type: 'text', text: accumulatedText }],
        });
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