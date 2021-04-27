import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/admin';

export const getBookListApiMethod = () =>
  sendRequest(`${BASE_PATH}/books`, {
    method: 'GET',
  });

export const addBookApiMethod = ({ name, price, githubRepo }) =>
  sendRequest(`${BASE_PATH}/books/add`, {
    body: JSON.stringify({ name, price, githubRepo }),
  });

export const addAdvertisementApiMethod = ({ name, uri, website }) =>
  sendRequest(`${BASE_PATH}/advertisements/add`, {
    body: JSON.stringify({ name, uri, website }),
  });

export const removeAdvertisementApiMethod = ({ _id }) =>
  sendRequest(`${BASE_PATH}/advertisements/remove`, {
    body: JSON.stringify({ _id }),
  });

export const editBookApiMethod = ({ id, name, price, githubRepo }) =>
  sendRequest(`${BASE_PATH}/books/edit`, {
    body: JSON.stringify({
      id,
      name,
      price,
      githubRepo,
    }),
  });

export const editAdvertisementApiMethod = ({
  _id,
  name,
  website,
  question,
  quiz,
  correctAnswer,
  uri,
  longitude,
  latitude,
  radius,
}) =>
  sendRequest(`${BASE_PATH}/advertisements/edit`, {
    body: JSON.stringify({
      _id,
      name,
      website,
      question,
      quiz,
      correctAnswer,
      uri,
      longitude,
      latitude,
      radius,
    }),
  });

export const getBookDetailApiMethod = ({ slug }) =>
  sendRequest(`${BASE_PATH}/books/detail/${slug}`, {
    method: 'GET',
  });

export const getAdvertisementApiMethod = ({ slug }) =>
  sendRequest(`${BASE_PATH}/advertisements/detail/${slug}`, {
    method: 'GET',
  });

// github methods

export const getGithubReposApiMethod = () =>
  sendRequest(`${BASE_PATH}/github/repos`, {
    method: 'GET',
  });

export const syncBookContentApiMethod = ({ bookId }) =>
  sendRequest(`${BASE_PATH}/books/sync-content`, {
    body: JSON.stringify({ bookId }),
  });
