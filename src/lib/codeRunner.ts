import { TestCase } from './codingProblems'

export interface TestOutcome {
  args: unknown[]
  expected: unknown
  actual: unknown
  pass: boolean
  error?: string
}

export interface RunResult {
  allPass: boolean
  outcomes: TestOutcome[]
  fatalError?: string
}

// Runs user-submitted code in a dedicated Web Worker — its own isolated
// global scope with no DOM or app-state access — so it can't touch the
// rest of the page, and a hard timeout guards against infinite loops by
// just terminating that worker thread.
const WORKER_SOURCE = `
self.onmessage = function (e) {
  const { code, functionName, tests } = e.data;
  try {
    const factory = new Function(code + '\\nreturn typeof ' + functionName + ' === "function" ? ' + functionName + ' : null;');
    const fn = factory();
    if (!fn) {
      self.postMessage({ fatalError: 'No function named "' + functionName + '" was found in your code.' });
      return;
    }
    const outcomes = tests.map((t) => {
      try {
        const actual = fn.apply(null, t.args);
        const pass = JSON.stringify(actual) === JSON.stringify(t.expected);
        return { args: t.args, expected: t.expected, actual, pass };
      } catch (err) {
        return { args: t.args, expected: t.expected, actual: undefined, pass: false, error: String((err && err.message) || err) };
      }
    });
    self.postMessage({ outcomes });
  } catch (err) {
    self.postMessage({ fatalError: String((err && err.message) || err) });
  }
};
`

export function runInSandbox(code: string, functionName: string, tests: TestCase[], timeoutMs = 3000): Promise<RunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    let settled = false

    const finish = (result: RunResult) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(result)
    }

    const timeoutId = window.setTimeout(() => {
      finish({ allPass: false, outcomes: [], fatalError: 'Timed out after 3 seconds — check for an infinite loop.' })
    }, timeoutMs)

    worker.onmessage = (e) => {
      const data = e.data as { outcomes?: TestOutcome[]; fatalError?: string }
      if (data.fatalError) {
        finish({ allPass: false, outcomes: [], fatalError: data.fatalError })
      } else {
        const outcomes = data.outcomes ?? []
        finish({ allPass: outcomes.length > 0 && outcomes.every((o) => o.pass), outcomes })
      }
    }

    worker.onerror = (e) => {
      finish({ allPass: false, outcomes: [], fatalError: e.message || 'Worker error' })
    }

    worker.postMessage({ code, functionName, tests })
  })
}
