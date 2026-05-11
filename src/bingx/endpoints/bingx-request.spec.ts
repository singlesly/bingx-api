import { transformBingxResponse } from 'bingx-api/bingx/endpoints/bingx-request';

describe('transformBingxResponse', () => {
  it('parses JSON responses with big number support', () => {
    expect(transformBingxResponse('{"code":0,"data":{"id":123}}')).toEqual({
      code: '0',
      data: { id: '123' },
    });
  });

  it('passes binary responses through without logging parse errors', () => {
    const response = Buffer.from('xlsx data');
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(transformBingxResponse(response)).toBe(response);
    expect(consoleError).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
