import cluster, { Cluster } from 'cluster'
import * as os from 'os'

const numCPUs = os.cpus().length

export class ClusterService {
  static clusterInstance: Cluster = cluster

  static clusterize(callback: () => void): void {
    if (this.clusterInstance.isPrimary) {
      console.log(`Master server started on ${process.pid}`)

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
