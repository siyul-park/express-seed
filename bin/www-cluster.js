const cluster = require('cluster');
const os = require('os');
const uuid = require('uuid');
const config = require('../app/config/environment');
const server = require('../app/server');


cluster.schedulingPolicy = cluster.SCHED_RR;
const instanceId = uuid.v4();

const cpuCount = os.cpus().length;
const workerCount = cpuCount / config.numberOfContainers;

if (cluster.isMaster) {
  config.logger.log(`Server ID : ${instanceId}`);
  config.logger.log(`Server CPU Number : ${cpuCount}`);
  config.logger.log(`Create Worker Number : ${workerCount}`);

  const workerMsgListener = (msg) => {
    const { workerId } = msg;

    if (msg.cmd === 'MASTER_ID') {
      cluster.workers[workerId].send({ cmd: 'MASTER_ID', masterId: instanceId });
    }
  };

  for (let i = 0; i < workerCount; i++) {
    config.logger.log(`Create Worker [${i + 1}/${workerCount}]`);
    const worker = cluster.fork();

    worker.on('message', workerMsgListener);
  }

  cluster.on('online', (worker) => {
    config.logger.log(`Worker[${worker.process.pid}] online`);
  });

  cluster.on('exit', (worker) => {
    config.logger.log(`Worker[${worker.process.pid}] death`);
    config.logger.log('Create other worker');

    const newWorker = cluster.fork();
    newWorker.on('message', workerMsgListener);
  });
} else if (cluster.isWorker) {
  const workerId = cluster.worker.id;

  process.send({ workerId, cmd: 'MASTER_ID' });
  process.on('message', (msg) => {
    if (msg.cmd === 'MASTER_ID') {
      server.run(msg.masterId, cluster.worker.id);
    }
  });
}
