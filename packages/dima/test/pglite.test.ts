import { assert, layer } from "@effect/vitest"
import { PgliteClient } from "@effect/sql-pglite"
import { Effect } from "effect"
import { SqlClient } from "effect/sql"

layer(PgliteClient.layer())("PGlite", (it) => {
  it.effect("runs queries in-process", () =>
    Effect.gen(function*() {
      const sql = yield* SqlClient.SqlClient
      const rows = yield* sql<{ readonly answer: number }>`SELECT 1 AS answer`
      assert.deepStrictEqual(rows, [{ answer: 1 }])
    }))
})
