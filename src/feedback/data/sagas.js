import { put } from 'redux-saga/effects';

import { addMessage, clearMessages } from './actions';
import { MESSAGE_TYPES } from './constants';

export function* handleErrors(e, clearExistingMessages) {
  if (clearExistingMessages) {
    yield put(clearMessages());
  }

  // If this doesn't contain anything we understand, add a fallback error message
  if (e.errors === undefined && e.fieldErrors === undefined && e.messages === undefined) {
    yield put(addMessage('fallback-error', null, {}, MESSAGE_TYPES.ERROR));
  }
  if (e.errors !== undefined) {
    for (let i = 0; i < e.errors.length; i++) { // eslint-disable-line no-plusplus
      const error = e.errors[i];
      yield put(addMessage(error.code, error.userMessage, error.data, error.messageType));
    }
  }
  if (e.messages !== undefined) {
    for (let i = 0; i < e.messages.length; i++) { // eslint-disable-line no-plusplus
      const message = e.messages[i];
      yield put(addMessage(message.code, message.userMessage, message.data, message.messageType));
    }
  }
  if (e.fieldErrors !== undefined) {
    for (let i = 0; i < e.fieldErrors.length; i++) { // eslint-disable-line no-plusplus
      const fieldError = e.fieldErrors[i];
      yield put(addMessage(
        fieldError.code,
        fieldError.userMessage,
        fieldError.data,
        MESSAGE_TYPES.ERROR,
        fieldError.fieldName,
      ));
    }
  }
}

export function* handleMessages(messages, clearExistingMessages, url) {
  // If this doesn't contain anything we understand, bail.
  if (!Array.isArray(messages)) {
    return null;
  }

  if (clearExistingMessages) {
    yield put(clearMessages());
  }

  // Display an error message if one is passed through as a url parameter
  if (url && url.indexOf('error_message') > 0) {
    const errorMessage = new URLSearchParams(url).get('error_message');
    yield put(addMessage('error_message', `${errorMessage}`, {}, MESSAGE_TYPES.ERROR));
  }

  for (let i = 0; i < messages.length; i++) { // eslint-disable-line no-plusplus
    const message = messages[i];
    yield put(addMessage(message.code, message.userMessage, message.data, message.messageType));
  }
  return null;
}
