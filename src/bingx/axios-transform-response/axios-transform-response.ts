import JSONBigNumber from 'json-bignumber';

export const axiosTransformResponse = (res: unknown) => {
  try {
    if (res === '') {
      return res;
    }

    if (typeof res !== 'string') {
      return res;
    }

    return JSON.parse(JSON.stringify(JSONBigNumber.parse(res)));
  } catch (e) {
    console.error('BingxRequest.http.transformResponse', e, res);
    return res;
  }
};
