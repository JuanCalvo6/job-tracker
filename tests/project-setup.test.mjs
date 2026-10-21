import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'))

test('provides the required project scripts', async () => {
  const packageJson = await readJson(new URL('../package.json', import.meta.url))

  assert.equal(typeof packageJson.scripts.dev, 'string')
  assert.equal(typeof packageJson.scripts.build, 'string')
  assert.equal(typeof packageJson.scripts.lint, 'string')
  assert.equal(typeof packageJson.scripts.test, 'string')
})

test('enables strict TypeScript', async () => {
  const tsconfig = await readJson(new URL('../tsconfig.json', import.meta.url))

  assert.equal(tsconfig.compilerOptions.strict, true)
})
