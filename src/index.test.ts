import * as cluster from 'cluster'
import { ClusterService } from './index'

const mockClusterizeCallback = jest.fn()
const mockClusterFork = jest.fn()
const mockClusterOn = jest.fn(() => mockClusterFork)

jest.mock('os', () => ({
  cpus: () => [1, 2, 3, 4, 5, 6],
}))

jest.mock('cluster')

const clusterInstance: any = cluster

clusterInstance.default.fork = mockClusterFork
clusterInstance.default.on = mockClusterOn

describe('The cluster', () => {
  jest.spyOn(console, 'log').mockImplementation((): boolean => false)

  beforeEach(() => {
    mockClusterFork.mockClear()
    mockClusterizeCallback.mockClear()
    mockClusterOn.mockClear()
  })

  it('should execute clusterize if isMaster', () => {
    clusterInstance.default.isMaster = true

    ClusterService.clusterize(mockClusterizeCallback)

    expect(mockClusterFork).toBeCalledTimes(6)
    expect(mockClusterizeCallback).toBeCalledTimes(0)
  })

  it('should handle an "on(\'exit\')" event', () => {
    clusterInstance.default.isMaster = true

    const mockExitEventCallback = jest.fn((event, callback) =>
      callback({ process: { pid: 1234 } }),
    )

    const spyClusterIntanceOn = jest
      .spyOn(clusterInstance, 'on')
      .mockImplementation(mockExitEventCallback)

    ClusterService.clusterize(mockClusterizeCallback)

    expect(spyClusterIntanceOn).toBeCalledWith('exit', expect.any(Function))
    expect(mockClusterizeCallback).toBeCalledTimes(0)
    expect(mockClusterFork).toBeCalledTimes(7)

    spyClusterIntanceOn.mockRestore()
  })

  it('should execute callback if not isMaster', () => {
    clusterInstance.default.isMaster = false

    ClusterService.clusterize(mockClusterizeCallback)

    expect(mockClusterizeCallback).toBeCalledTimes(1)
    expect(mockClusterOn).toBeCalledTimes(0)
    expect(mockClusterFork).toBeCalledTimes(0)
  })

  it('should call on with exit successfully', () => {
    clusterInstance.default.isMaster = true

    ClusterService.clusterize(mockClusterizeCallback)
    clusterInstance.disconnect()

    expect(mockClusterizeCallback).toBeCalledTimes(0)
    expect(mockClusterFork).toBeCalledTimes(6)
    expect(mockClusterOn).toBeCalledTimes(1)
    expect(mockClusterOn).toBeCalledWith('exit', expect.any(Function))
  })
})
