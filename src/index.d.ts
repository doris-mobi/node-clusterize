/// <reference types="node" />
import { Cluster } from 'cluster';
export declare class ClusterService {
    static clusterInstance: Cluster;
    static clusterize(callback: () => void): void;
}
