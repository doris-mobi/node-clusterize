import * as cluster from 'cluster'
import * as os from 'os'

const numCPUs = os.cpus().length

export class ClusterService {
  private static _clusterInstance: any = cluster

  private static get clusterInstance(): cluster.Cluster {
    return ClusterService._clusterInstance
  }

  static clusterize(callback: () => void): void {
    if (this.clusterInstance.isMaster) {
      console.log(`Primary server started on ${process.pid}`)

      for (let i = 0; i < numCPUs; i++) {
        this.clusterInstance.fork()
      }

      this.clusterInstance.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died. Restarting`)
        this.clusterInstance.fork()
      })
    } else {
      console.log(`Cluster server started on ${process.pid}`)
      callback()
    }
  }
}
