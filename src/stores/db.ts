import { ref } from 'vue'
import { defineStore } from 'pinia'
import { LocalFirstDB } from '../../local-first-db/src/database' // Import directly from src if not built yet
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs'
import wasmUrl from 'wa-sqlite/dist/wa-sqlite-async.wasm?url'

import * as SQLite from 'wa-sqlite'
// @ts-ignore
import { IDBBatchAtomicVFS } from 'wa-sqlite/src/examples/IDBBatchAtomicVFS.js'

export const useDatabaseStore = defineStore('database', () => {
  const isReady = ref(false)
  const db = ref<LocalFirstDB | null>(null)

  async function init() {
    if (isReady.value) return;
    
    console.log('Initializing LocalFirstDB...');
    const database = new LocalFirstDB('stillnotes-db');
    
    // @ts-ignore
    const module = await SQLiteESMFactory({
      locateFile: () => wasmUrl,
    });
    
    const sqlite3 = SQLite.Factory(module);
    const vfs = new IDBBatchAtomicVFS('my-vfs');
    await sqlite3.vfs_register(vfs, true);
    
    const conn = await sqlite3.open_v2('stillnotes-db');

    // Sanitize a single value so wa-sqlite can accept it
    const sanitize = (v: any): SQLite.SQLiteCompatibleType => {
      if (v === undefined || v === null) return null;
      if (typeof v === 'boolean') return v ? 1 : 0;
      if (typeof v === 'number') return v;
      if (typeof v === 'string') return v;
      if (v instanceof Uint8Array) return v;
      // Arrays, objects, etc. → store as JSON text
      return JSON.stringify(v);
    };

    // Promise chain used as a mutex to serialize concurrent DB access.
    // Without this, multiple stores (notes, drafts, tags) calling exec()
    // simultaneously on the same connection causes SQLite API misuse errors.
    let dbMutex: Promise<any> = Promise.resolve([]);

    const dbAdapter = {
      exec: (sql: string, params: any[] = []): Promise<any[]> => {
        const next = dbMutex.then(async () => {
          const objects: any[] = [];
          const sanitizedParams = params.map(sanitize);

          for await (const stmt of sqlite3.statements(conn, sql)) {
            const bindCount = sqlite3.bind_parameter_count(stmt);
            for (let i = 0; i < bindCount && i < sanitizedParams.length; i++) {
              sqlite3.bind(stmt, i + 1, sanitizedParams[i]);
            }
            while (await sqlite3.step(stmt) === SQLite.SQLITE_ROW) {
              const colNames = sqlite3.column_names(stmt);
              const row: any = {};
              for (let i = 0; i < colNames.length; i++) {
                row[colNames[i]] = sqlite3.column(stmt, i);
              }
              objects.push(row);
            }
          }
          return objects;
        });

        // Swallow errors in the chain so a failed exec doesn't block future ones
        dbMutex = next.catch(() => []);
        return next;
      }
    };

    await database.init(dbAdapter);
    
    db.value = database;
    isReady.value = true;
    console.log('LocalFirstDB initialized successfully.');
  }

  // Helper function to safely execute DB queries once ready
  async function execute<T>(callback: (database: LocalFirstDB) => Promise<T>): Promise<T> {
    if (!isReady.value) {
        await init();
    }
    return callback(db.value as LocalFirstDB);
  }

  return { isReady, db, init, execute }
})
