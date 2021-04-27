/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import NProgress from 'nprogress';
import Link from 'next/link';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import notify from '../../../lib/notify';
import { addAdvertisementApiMethod } from '../../../lib/api/admin';

function CreateAdvertisementPage() {
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');
  const [website, setWebsite] = useState('');
  const [question, setQuestion] = useState('');
  const [quiz1, setQuiz1] = useState('');
  const [quiz2, setQuiz2] = useState('');
  const [quiz3, setQuiz3] = useState('');
  const [quiz4, setQuiz4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [radius, setRadius] = useState(null);

  async function createAd() {
    if (name && uri) {
      NProgress.start();
      try {
        await addAdvertisementApiMethod({
          name,
          uri,
          website,
        });
        notify('Created');
        NProgress.done();
        Router.push('/dashboard');
      } catch (err) {
        notify(err);
        NProgress.done();
      }
    } else {
      notify('Ad must have Name and URI');
    }
  }

  return (
    <>
      <div className="topRow">
        <div className="title">Create Advertisement</div>
        <div className="listContainer">
          <div className="adItem">
            Name:{' '}
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Uri:{' '}
            <input
              type="text"
              value={uri}
              onChange={(event) => {
                setUri(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Website:{' '}
            <input
              type="text"
              value={website}
              onChange={(event) => {
                setWebsite(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Question:{' '}
            <input
              type="text"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Choice:{' '}
            <input
              type="text"
              value={quiz1}
              onChange={(event) => {
                // this is incorrect
                setQuiz1(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Choice:{' '}
            <input
              type="text"
              value={quiz2}
              onChange={(event) => {
                // this is incorrect
                setQuiz2(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Choice:{' '}
            <input
              type="text"
              value={quiz3}
              onChange={(event) => {
                // this is incorrect
                setQuiz3(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Choice:{' '}
            <input
              type="text"
              value={quiz4}
              onChange={(event) => {
                // this is incorrect
                setQuiz4(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Correct Answer:{' '}
            <input
              type="text"
              value={correctAnswer}
              onChange={(event) => {
                setCorrectAnswer(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Longitude:{' '}
            <input
              type="text"
              value={longitude}
              onChange={(event) => {
                setLongitude(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Latitude:{' '}
            <input
              type="text"
              value={latitude}
              onChange={(event) => {
                setLatitude(event.target.value);
              }}
            />
          </div>
          <div className="adItem">
            Radius:{' '}
            <input
              type="text"
              value={radius}
              onChange={(event) => {
                setRadius(event.target.value);
              }}
            />
          </div>
          <Button variant="contained" onClick={() => createAd()}>
            Create
          </Button>
          <Link href="/dashboard">
            <Button variant="contained">Cancel</Button>
          </Link>
        </div>
      </div>
      <style jsx>
        {`
          .topRow {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding-top: 200px;
            padding-bottom: 15px;
            margin-left: 15%;
            margin-right: 15%;
            padding-bottom: 50px;
          }
          @media (max-width: 768px) {
            .topRow {
              padding-top: 200px;
              padding-bottom: 15px;
            }
          }
          .listContainer {
            flex-direction: column;
          }
          .title {
            align-self: center;
            font-size: 36px;
            margin-bottom: 40px;
          }
          .adItem {
            margin-top: 5px;
            margin-bottom: 5px;
          }
        `}
      </style>
    </>
  );
}

export default CreateAdvertisementPage;
