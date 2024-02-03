import { axiosTransformResponse } from 'bingx-api/bingx/axios-transform-response/axios-transform-response';

describe('axios transform response', () => {
  it('try with empty string', () => {
    const res = axiosTransformResponse('');

    expect(res).toStrictEqual('');
  });

  it('try with 0', () => {
    const res = axiosTransformResponse(0);

    expect(res).toStrictEqual(0);
  });
});
