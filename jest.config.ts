import type {JestConfigWithTsJest} from 'ts-jest'
import {getJestProjectsAsync} from '@nx/jest'

export default async () =>
  ({
    projects: await getJestProjectsAsync(),
  }) satisfies JestConfigWithTsJest
