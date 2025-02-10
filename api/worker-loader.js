import { workerData, parentPort } from "worker_threads";

(async () => {
    try {
        const { default: subApp } = await import(pathToFileURL(workerData.subAppPath).href);
        parentPort.postMessage(subApp);
    } catch (error) {
        parentPort.postMessage(null);
    }
})();
