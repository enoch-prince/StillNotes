/**
 * Example: Complete Local-First Database Demo
 * 
 * This demonstrates:
 * - Setting up wa-sqlite in the browser
 * - Creating and syncing documents
 * - Handling offline/online scenarios
 * - Real-time updates
 */

import { LocalFirstDB } from './database';
import { SyncEngine } from './sync-engine';

// Mock wa-sqlite interface for demonstration
// In production, use: import SQLiteESMFactory from 'wa-sqlite';
interface SQLiteDB {
  exec(sql: string, params?: any[]): Promise<any[]>;
  close(): Promise<void>;
}

class WaSQLiteWrapper {
  private dbPromise: Promise<any>;

  constructor(dbName: string) {
    this.dbPromise = this.initializeDB(dbName);
  }

  private async initializeDB(dbName: string): Promise<any> {
    // In production, replace with actual wa-sqlite initialization:
    // const SQLite = await SQLiteESMFactory();
    // const db = await SQLite.open_v2(dbName);
    
    // For this demo, we'll use a mock
    console.log(`Initializing wa-sqlite database: ${dbName}`);
    
    return {
      exec: async (sql: string, params: any[] = []) => {
        // Mock implementation
        console.log('SQL:', sql.substring(0, 100), params);
        return [];
      },
      close: async () => {
        console.log('Closing database');
      },
    };
  }

  async exec(sql: string, params: any[] = []): Promise<any[]> {
    const db = await this.dbPromise;
    return db.exec(sql, params);
  }

  async close(): Promise<void> {
    const db = await this.dbPromise;
    return db.close();
  }
}

/**
 * Example usage
 */
export async function runDemo() {
  console.log('🚀 Starting Local-First Database Demo\n');

  // Step 1: Initialize database
  console.log('1️⃣  Initializing local database...');
  const db = new LocalFirstDB('my-app-db');
  const sqlite = new WaSQLiteWrapper('my-app-db');
  await db.init(sqlite);

  // Step 2: Create some documents
  console.log('\n2️⃣  Creating documents...');
  
  const user1 = await db.insert('users', {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
  });
  console.log('✓ Created user:', user1);

  const user2 = await db.insert('users', {
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
  });
  console.log('✓ Created user:', user2);

  const post1 = await db.insert('posts', {
    title: 'My First Post',
    content: 'This is a local-first database!',
    authorId: user1._id,
    published: true,
  });
  console.log('✓ Created post:', post1);

  // Step 3: Query documents
  console.log('\n3️⃣  Querying documents...');
  
  const allUsers = await db.find('users');
  console.log(`✓ Found ${allUsers.length} users:`, allUsers);

  const admins = await db.find('users', { role: 'admin' });
  console.log(`✓ Found ${admins.length} admins:`, admins);

  // Step 4: Update a document
  console.log('\n4️⃣  Updating document...');
  
  const updatedUser = await db.update('users', user1._id, {
    role: 'super-admin',
    lastLogin: Date.now(),
  });
  console.log('✓ Updated user:', updatedUser);

  // Step 5: Subscribe to changes
  console.log('\n5️⃣  Subscribing to changes...');
  
  const unsubscribe = db.onChange((operation) => {
    console.log('📢 Change detected:', {
      type: operation.type,
      collection: operation.collection,
      docId: operation.docId,
    });
  });

  // Step 6: Setup sync
  console.log('\n6️⃣  Setting up sync engine...');
  
  const syncEngine = new SyncEngine(db, {
    serverUrl: 'http://localhost:3000',
    batchSize: 50,
    retryAttempts: 3,
    onProgress: (progress) => {
      console.log(`📊 Sync progress: ${progress.phase} - ${progress.current}/${progress.total}`);
    },
    onError: (error) => {
      console.error('❌ Sync error:', error.message);
    },
  });

  // Start continuous sync (every 30 seconds)
  syncEngine.startContinuousSync(30000);

  // Step 7: Simulate offline/online scenario
  console.log('\n7️⃣  Simulating offline work...');
  
  // Simulate going offline
  console.log('📴 Going offline...');
  Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

  // Create documents while offline
  const offlinePost = await db.insert('posts', {
    title: 'Created Offline',
    content: 'This was created while offline!',
    authorId: user2._id,
    published: false,
  });
  console.log('✓ Created post offline:', offlinePost);

  await db.update('posts', post1._id, {
    content: 'Updated while offline',
  });
  console.log('✓ Updated post offline');

  // Check unsynced operations
  const unsynced = await db.getUnsyncedOperations();
  console.log(`📦 ${unsynced.length} operations waiting to sync`);

  // Simulate coming back online
  console.log('\n🌐 Coming back online...');
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  
  // Trigger manual sync
  const syncResult = await syncEngine.forceSyncNow();
  console.log('✅ Sync result:', syncResult);

  // Step 8: Demonstrate conflict resolution
  console.log('\n8️⃣  Demonstrating conflict resolution...');
  
  // Simulate concurrent edits from different clients
  const localEdit = await db.update('users', user2._id, {
    name: 'Bob Smith Jr.',
  });
  console.log('✓ Local edit:', localEdit);

  // Simulate remote edit (in real scenario, this comes from server)
  const remoteOperation = {
    id: 'remote-op-1',
    type: 'update' as const,
    collection: 'users',
    docId: user2._id,
    data: { email: 'bob.smith@newcompany.com' },
    timestamp: Date.now(),
    clientId: 'another-client',
    synced: true,
    vectorClock: { 'another-client': 5 },
  };

  await db.applyRemoteOperations([remoteOperation]);
  console.log('✓ Applied remote operation with conflict resolution');

  const mergedUser = await db.get('users', user2._id);
  console.log('✓ Merged result:', mergedUser);

  // Step 9: Get vector clock state
  console.log('\n9️⃣  Vector clock state:');
  console.log(db.getVectorClock());

  // Step 10: Cleanup
  console.log('\n🔟 Cleaning up...');
  unsubscribe();
  syncEngine.stopContinuousSync();

  console.log('\n✅ Demo completed!\n');
}

/**
 * React Hook example for using the database
 */
export function useLocalFirstDB(serverUrl: string) {
  const [db, setDb] = React.useState<LocalFirstDB | null>(null);
  const [syncEngine, setSyncEngine] = React.useState<SyncEngine | null>(null);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      // Initialize database
      const database = new LocalFirstDB('my-app');
      const sqlite = new WaSQLiteWrapper('my-app');
      await database.init(sqlite);
      setDb(database);

      // Setup sync
      const sync = new SyncEngine(database, {
        serverUrl,
        onProgress: (progress) => {
          setIsSyncing(progress.phase !== 'idle');
        },
      });

      sync.startContinuousSync(30000);
      setSyncEngine(sync);
    }

    init();

    return () => {
      syncEngine?.stopContinuousSync();
    };
  }, [serverUrl]);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncEngine?.forceSyncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncEngine]);

  return {
    db,
    syncEngine,
    isOnline,
    isSyncing,
  };
}

/**
 * Example React component
 */
export function TodoApp() {
  const { db, isOnline, isSyncing } = useLocalFirstDB('http://localhost:3000');
  const [todos, setTodos] = React.useState([]);
  const [newTodo, setNewTodo] = React.useState('');

  React.useEffect(() => {
    if (!db) return;

    // Load todos
    async function loadTodos() {
      const allTodos = await db.find('todos');
      setTodos(allTodos);
    }

    loadTodos();

    // Subscribe to changes
    const unsubscribe = db.onChange((op) => {
      if (op.collection === 'todos') {
        loadTodos();
      }
    });

    return unsubscribe;
  }, [db]);

  const addTodo = async () => {
    if (!db || !newTodo.trim()) return;

    await db.insert('todos', {
      text: newTodo,
      completed: false,
      createdAt: Date.now(),
    });

    setNewTodo('');
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (!db) return;
    await db.update('todos', id, { completed: !completed });
  };

  const deleteTodo = async (id: string) => {
    if (!db) return;
    await db.delete('todos', id);
  };

  return (
    <div className="todo-app">
      <header>
        <h1>Local-First Todo App</h1>
        <div className="status">
          {isOnline ? '🌐 Online' : '📴 Offline'}
          {isSyncing && ' (Syncing...)'}
        </div>
      </header>

      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo: any) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
            />
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Run the demo if this is the main module
if (typeof window !== 'undefined') {
  (window as any).runDemo = runDemo;
  console.log('💡 Run window.runDemo() to see the demo in action!');
}
