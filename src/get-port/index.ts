import * as net from 'net';

export async function getPortFree(): Promise<number> {
  return new Promise((res) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const info = srv.address() as net.AddressInfo;
      const port = Number(info.port);
      srv.close(() => res(port));
    });
  });
}
