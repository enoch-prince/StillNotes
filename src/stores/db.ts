import { ref, watch } from 'vue'
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
    
    // In Vite, wa-sqlite requires matching public paths or specific bundling.
    // For now, we assume the factory resolves natively.
    // @ts-ignore
    const module = await SQLiteESMFactory({
      locateFile: () => wasmUrl,
    });
    
    const sqlite3 = SQLite.Factory(module);
    const vfs = new IDBBatchAtomicVFS('my-vfs');
    await sqlite3.vfs_register(vfs, true);
    
    const conn = await sqlite3.open_v2('stillnotes-db');

    // Create an adapter for the local-first-db class which expects a .exec interface
    const dbAdapter = {
      exec: async (sql: string, params: any[] = []) => {
        const objects = [];
        for await (const stmt of sqlite3.statements(conn, sql)) {
          if (params) {
            for (let i = 0; i < params.length; i++) {
              let p = params[i];
              // Convert boolean to number for SQLite
              if (typeof p === 'boolean') p = p ? 1 : 0;
              sqlite3.bind(stmt, i + 1, p);
            }
          }
          while (await sqlite3.step(stmt) === SQLite.SQLITE_ROW) {
            const rowInfo = sqlite3.column_names(stmt);
            const row: any = {};
            for (let i = 0; i < rowInfo.length; i++) {
              row[rowInfo[i]] = sqlite3.column(stmt, i);
            }
            objects.push(row);
          }
        }
        return objects;
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
