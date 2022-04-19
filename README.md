# node-clusterize

Enables the creation of child processes (workers) that run simultaneously and share the same server port.

## Installation

```shell
$ yarn add @doris.mobi/node-clusterize
```

## Usage

```typescript
import { ClusterService } from '@doris.mobi/node-clusterize'

const application = () => {
  // your node application logic
}

ClusterService.clusterize(application)
```
