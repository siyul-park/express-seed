const cluster = require('cluster');
const os = require('os');
const uuid = require('uuid');
const config = require('../app/config/environment');
const logger = require('../app/logger');
const server = require('../app/server');


cluster.schedulingPolicy = cluster.SCHED_RR;

const instanceId = uuid.v4();
const cpuCount = os.cpus().length;
const workerCount = cpuCount / config.numberOfContainers;

function workerMsgListener(msg) {
  const { workerId } = msg;

  if (msg.cmd === 'MASTER_ID') {
    cluster.workers[workerId].send({ cmd: 'MASTER_ID', masterId: instanceId });
  }
}

function createWorker(count) {
  for (let i = 0; i < count; i++) {
    logger.info(`Create Worker [${i + 1}/${count}]`);
    const worker = cluster.fork();

    worker.on('message', workerMsgListener);
  }
}

function setOnlineListener() {
  cluster.on('online', (worker) => {
    logger.info(`Worker[${worker.process.pid}] online`);
  });
}

function setExitListener() {
  cluster.on('exit', (worker) => {
    logger.error(`Worker[${worker.process.pid}] death`);
    logger.info('Create other worker');

    const newWorker = cluster.fork();
    newWorker.on('message', workerMsgListener);
  });
}

if (cluster.isMaster) {
  logger.info(`Server ID : ${instanceId}`);
  logger.info(`Server CPU Number : ${cpuCount}`);
  logger.info(`Create Worker Number : ${workerCount}`);

  createWorker(workerCount);

  setOnlineListener();
  setExitListener();
} else if (cluster.isWorker) {
  const workerId = cluster.worker.id;

  process.send({ workerId, cmd: 'MASTER_ID' });
  process.on('message', (msg) => {
    if (msg.cmd === 'MASTER_ID') {
      server.run(msg.masterId, cluster.worker.id);
    }
  });
}
