import cluster from 'cluster';
import http from 'http';
import os from 'os';

const PORT:number = parseInt(process.env.PORT || '4000');
const numOfParal = os.availableParallelism();
const workersAmount = numOfParal - 1;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} started`);


  for (let i = 0; i < workersAmount; i++) {
    cluster.fork({
      WORKER_PORT: PORT + i + 1,
      WORKER_ID: i
    });
  }


  const balancer = http.createServer((req, res) => {
      const workers = cluster.workers ? Object.values(cluster.workers) : [];
    if (!workers.length) {
      res.writeHead(503);
      return res.end('No workers available');
    }


    const workerIndex = Math.floor(Math.random() * workersAmount);
    const workerPort = PORT + 1 + workerIndex;
    

    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(502);
      res.end('Bad Gateway. Rstart or send request again, please');
    });
  });

  balancer.listen(PORT, () => {
    console.log(`Load balancer is running on port ${PORT}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

} else {
  import('./worker').catch(err => {
    console.error('Worker failed to start:', err);
    process.exit(1);
  });
}