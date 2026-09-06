import { AxiosError, AxiosHeaders } from 'axios';
import { toFriendlyMessage, toFieldErrors } from './api';

function makeAxiosError(status: number, data: unknown): AxiosError {
  const err = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
  err.response = {
    status,
    data,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as AxiosError['response'];
  return err;
}

describe('toFriendlyMessage', () => {
  it('returns the backend error message when present', () => {
    const err = makeAxiosError(422, {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Please correct the highlighted fields' },
    });
    expect(toFriendlyMessage(err)).toBe('Please correct the highlighted fields');
  });

  it('maps a bare 401 to a credentials message', () => {
    const err = makeAxiosError(401, {});
    expect(toFriendlyMessage(err)).toMatch(/incorrect/i);
  });

  it('handles a network error (no response)', () => {
    const err = new AxiosError('Network Error');
    expect(toFriendlyMessage(err)).toMatch(/could not reach the server/i);
  });

  it('falls back for a non-axios error', () => {
    expect(toFriendlyMessage(new Error('boom'), 'fallback text')).toBe('fallback text');
  });
});

describe('toFieldErrors', () => {
  it('extracts field-keyed messages from error.details', () => {
    const err = makeAxiosError(422, {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'bad',
        details: [
          { field: 'email', message: 'Enter a valid email' },
          { field: 'password', message: 'Too short' },
        ],
      },
    });
    expect(toFieldErrors(err)).toEqual({
      email: 'Enter a valid email',
      password: 'Too short',
    });
  });

  it('returns an empty object when there are no details', () => {
    expect(toFieldErrors(makeAxiosError(500, {}))).toEqual({});
  });
});
