import type { BinaryLike } from 'node:crypto'
import type { ProcessVersions } from 'node:process'
import type { Ollama } from 'ollama'

export interface IElectronAPI {
  versions: ProcessVersions
  sha256sum: (data: BinaryLike) => string
  send: (channel: string, message: string) => Promise<any>
  ollama: Ollama
}

declare global {
  interface Window extends IElectronAPI {}
}
