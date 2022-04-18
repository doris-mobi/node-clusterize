import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  rootDir: 'src',
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}

export default config
