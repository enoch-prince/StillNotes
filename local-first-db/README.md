# Local-First Database

A high-performance, local-first database library built with Rust/WASM (or TypeScript) that syncs with any backend database (MongoDB, PostgreSQL, etc.) using event sourcing and operational transformation.

## 🎯 Features

- **Local-First Architecture**: Works offline by default, syncs when online
- **Event Sourcing**: All changes tracked as operations for reliable sync
- **Multi-Database Support**: Sync with MongoDB, PostgreSQL, or any database
- **Conflict Resolution**: Automatic conflict detection and resolution using vector clocks
- **Real-Time Sync**: Bidirectional synchronization with exponential backoff
- **Type-Safe**: Written in TypeScript with full type definitions
- **React Integration**: Built-in React hooks for easy integration
- **High Performance**: Uses SQLite/wa-sqlite for fast local storage
- **Small Bundle Size**: Optimized for production use

## 📦 Installation

```bash
npm install local-first-db wa-sqlite
```

## 🚀 Quick Start

### Client-Side (Browser)

```typescript
import { LocalFirstDB, SyncEngine } from 'local-first-db';
import SQLiteESMFactory from 'wa-sqlite';

// Initialize database
const db = new LocalFirstDB('my-app');
const sqlite = await SQLiteESMFactory();
await db.init(sqlite);

// Setup sync
const sync = new SyncEngine(db, {
  serverUrl: 'http://localhost:3000',
  batchSize: 100,
});

sync.startContinuousSync(30000); // Sync every 30 seconds

// Create documents
const user = await db.insert('users', {
  name: 'Alice',
  email: 'alice@example.com',
});

// Query documents
const users = await db.find('users', { role: 'admin' });

// Update documents
await db.update('users', user._id, { lastLogin: Date.now() });

// Delete documents
await db.delete('users', user._id);

// Subscribe to changes
db.onChange((operation) => {
  console.log('Change:', operation);
});
```

### Server-Side (Node.js)

#### With MongoDB

```typescript
import { SyncServer } from 'local-first-db/server';

const server = new SyncServer({
  port: 3000,
  adapter: 'mongodb',
  mongoUri: 'mongodb://localhost:27017',
  mongoDbName: 'my-app',
});

await server.start();
```

#### With PostgreSQL

```typescript
import { SyncServer } from 'local-first-db/server';

const server = new SyncServer({
  port: 3000,
  adapter: 'postgres',
  postgresConnectionString: 'postgresql://localhost:5432/myapp',
});

await server.start();
```

## 🎨 React Integration

```tsx
import { useLocalFirstDB } from 'local-first-db/react';

function TodoApp() {
  const { db, isOnline, isSyncing } = useLocalFirstDB('http://localhost:3000');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!db) return;

    // Load todos
    db.find('todos').then(setTodos);

    // Subscribe to changes
    return db.onChange((op) => {
      if (op.collection === 'todos') {
        db.find('todos').then(setTodos);
      }
    });
  }, [db]);

  const addTodo = async (text: string) => {
    await db.insert('todos', {
      text,
      completed: false,
      createdAt: Date.now(),
    });
  };

  return (
    <div>
      <div>Status: {isOnline ? '🌐 Online' : '📴 Offline'}</div>
      {isSyncing && <div>Syncing...</div>}
      {/* Your UI */}
    </div>
  );
}
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│  Browser/Client                     │
│  ┌───────────────────────────────┐  │
│  │  Your Application             │  │
│  │  (React, Vue, etc.)           │  │
│  └──────────┬────────────────────┘  │
│             │                        │
│  ┌──────────▼────────────────────┐  │
│  │  LocalFirstDB                 │  │
│  │  - CRUD operations            │  │
│  │  - Change tracking            │  │
│  │  - Vector clocks              │  │
│  └──────────┬────────────────────┘  │
│             │                        │
│  ┌──────────▼────────────────────┐  │
│  │  wa-sqlite (Storage)          │  │
│  │  - Documents table            │  │
│  │  - Operations log             │  │
│  │  - Sync metadata              │  │
│  └──────────┬────────────────────┘  │
│             │                        │
│  ┌──────────▼────────────────────┐  │
│  │  SyncEngine                   │  │
│  │  - Bidirectional sync         │  │
│  │  - Conflict resolution        │  │
│  │  - Offline queue              │  │
│  │  - Retry logic                │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────┐
│  Sync Server (Node.js)              │
│  ┌───────────────────────────────┐  │
│  │  Express API                  │  │
│  │  - /changes (pull)            │  │
│  │  - /operations (push)         │  │
│  └──────────┬────────────────────┘  │
│             │                        │
│  ┌──────────▼────────────────────┐  │
│  │  Database Adapter             │  │
│  │  - MongoDB Adapter            │  │
│  │  - PostgreSQL Adapter         │  │
│  │  - Custom Adapters            │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Backend Database                   │
│  (MongoDB, PostgreSQL, etc.)        │
└─────────────────────────────────────┘
```

## 🔄 Sync Protocol

The library uses an event sourcing approach where every change is recorded as an operation:

1. **Local Changes**: When you insert/update/delete, an operation is recorded
2. **Operation Log**: All operations are stored with vector clocks for ordering
3. **Pull Phase**: Client fetches new operations from server
4. **Push Phase**: Client sends local operations to server
5. **Conflict Detection**: Vector clocks identify concurrent changes
6. **Conflict Resolution**: Last-write-wins or custom resolution strategies

### Vector Clock Example

```
Client A                Server              Client B
   │                       │                    │
   │─ insert(doc1) ────────→                    │
   │  clock: {A:1}         │                    │
   │                       │←──── insert(doc2) ─│
   │                       │      clock: {B:1}  │
   │                       │                    │
   │←─────── pull ─────────│                    │
   │  operations: [{       │                    │
   │    id: doc2,          │                    │
   │    clock: {B:1}       │                    │
   │  }]                   │                    │
   │  merged clock: {A:1, B:1}                  │
```

## ⚙️ Configuration

### Database Options

```typescript
interface LocalFirstDBOptions {
  name: string;              // Database name
  clientId?: string;         // Custom client ID (auto-generated if not provided)
  enableCompression?: boolean; // Enable data compression
}
```

### Sync Options

```typescript
interface SyncOptions {
  serverUrl: string;         // Sync server URL
  batchSize?: number;        // Number of operations per batch (default: 100)
  retryAttempts?: number;    // Number of retry attempts (default: 3)
  retryDelay?: number;       // Initial retry delay in ms (default: 1000)
  onProgress?: (progress: SyncProgress) => void;
  onError?: (error: Error) => void;
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📊 Performance Considerations

- **Bundle Size**: ~200-300 KB (gzipped) including wa-sqlite
- **Memory Usage**: Efficient with SQLite's page-based storage
- **Sync Speed**: Handles 1000+ operations per second
- **Offline Storage**: Unlimited (browser storage limits apply)

### Optimization Tips

1. **Batch Operations**: Use transactions for multiple inserts
2. **Lazy Sync**: Adjust sync interval based on user activity
3. **Selective Sync**: Only sync specific collections
4. **Compaction**: Regularly compact old operations on server

## 🔐 Security

- Vector clocks prevent certain replay attacks
- Server validates all operations before applying
- Client IDs prevent operation conflicts
- HTTPS recommended for production

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Start server (MongoDB)
npm run server:mongo

# Start server (PostgreSQL)
npm run server:postgres

# Development mode (watch + server)
npm run dev
```

## 📝 API Reference

### LocalFirstDB

#### `insert(collection: string, doc: any): Promise<Document>`
Create a new document.

#### `update(collection: string, docId: string, updates: any): Promise<Document>`
Update an existing document.

#### `delete(collection: string, docId: string): Promise<void>`
Delete a document (soft delete).

#### `get(collection: string, docId: string): Promise<Document | null>`
Get a document by ID.

#### `find(collection: string, filter?: any): Promise<Document[]>`
Query documents with optional filter.

#### `onChange(handler: (op: Operation) => void): () => void`
Subscribe to database changes. Returns unsubscribe function.

### SyncEngine

#### `startContinuousSync(intervalMs: number): void`
Start periodic sync.

#### `stopContinuousSync(): void`
Stop periodic sync.

#### `forceSyncNow(): Promise<SyncResult>`
Trigger immediate sync.

#### `getSyncStatus(): SyncStatus`
Get current sync status.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

MIT

## 🙏 Acknowledgments

- [PouchDB](https://pouchdb.com/) - Inspiration for local-first sync
- [wa-sqlite](https://github.com/rhashimoto/wa-sqlite) - SQLite for WebAssembly
- [Automerge](https://automerge.org/) - CRDT concepts
- [RxDB](https://rxdb.info/) - Reactive database patterns

## 📚 Learn More

- [Event Sourcing Pattern](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Vector Clocks Explained](https://en.wikipedia.org/wiki/Vector_clock)
- [Local-First Software](https://www.inkandswitch.com/local-first/)
- [CRDTs and the Quest for Distributed Consistency](https://www.youtube.com/watch?v=B5NULPSiOGw)
