# Quick Start Guide

Get up and running with Local-First DB in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB OR PostgreSQL running locally (or use cloud services)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Choose Your Database

### Option A: MongoDB

1. Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

2. Start the sync server:
```bash
npm run server:mongo
```

### Option B: PostgreSQL

1. Create a database:
```sql
CREATE DATABASE local_first_db;
```

2. Start the sync server:
```bash
npm run server:postgres
```

## Step 3: Use in Your App

### Vanilla JavaScript/TypeScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Local-First Todo App</title>
</head>
<body>
  <div id="app">
    <h1>My Todos</h1>
    <div id="status"></div>
    <input type="text" id="todo-input" placeholder="New todo...">
    <button onclick="addTodo()">Add</button>
    <ul id="todo-list"></ul>
  </div>

  <script type="module">
    import { LocalFirstDB, SyncEngine } from './dist/index.js';
    import SQLiteESMFactory from 'https://cdn.jsdelivr.net/npm/wa-sqlite@0.9.9/+esm';

    let db, syncEngine;

    async function init() {
      // Initialize database
      db = new LocalFirstDB('todos-app');
      const sqlite = await SQLiteESMFactory();
      await db.init(sqlite);

      // Setup sync
      syncEngine = new SyncEngine(db, {
        serverUrl: 'http://localhost:3000',
        onProgress: (progress) => {
          document.getElementById('status').textContent = 
            progress.phase === 'idle' ? '✅ Synced' : `🔄 ${progress.phase}...`;
        },
      });

      syncEngine.startContinuousSync(10000);

      // Load and display todos
      await loadTodos();

      // Subscribe to changes
      db.onChange(() => loadTodos());

      // Update online status
      updateStatus();
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);
    }

    async function loadTodos() {
      const todos = await db.find('todos');
      const list = document.getElementById('todo-list');
      list.innerHTML = todos
        .map(todo => `
          <li>
            <input type="checkbox" 
              ${todo.completed ? 'checked' : ''} 
              onchange="toggleTodo('${todo._id}', ${!todo.completed})">
            <span style="${todo.completed ? 'text-decoration: line-through' : ''}">
              ${todo.text}
            </span>
            <button onclick="deleteTodo('${todo._id}')">Delete</button>
          </li>
        `)
        .join('');
    }

    window.addTodo = async function() {
      const input = document.getElementById('todo-input');
      if (!input.value.trim()) return;

      await db.insert('todos', {
        text: input.value,
        completed: false,
        createdAt: Date.now(),
      });

      input.value = '';
    };

    window.toggleTodo = async function(id, completed) {
      await db.update('todos', id, { completed });
    };

    window.deleteTodo = async function(id) {
      await db.delete('todos', id);
    };

    function updateStatus() {
      const status = document.getElementById('status');
      status.textContent = navigator.onLine ? '🌐 Online' : '📴 Offline';
    }

    // Initialize on page load
    init();
  </script>
</body>
</html>
```

### React

```tsx
import React, { useState, useEffect } from 'react';
import { LocalFirstDB, SyncEngine } from 'local-first-db';
import SQLiteESMFactory from 'wa-sqlite';

function App() {
  const [db, setDb] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize database
  useEffect(() => {
    async function init() {
      const database = new LocalFirstDB('todos-app');
      const sqlite = await SQLiteESMFactory();
      await database.init(sqlite);
      setDb(database);

      const sync = new SyncEngine(database, {
        serverUrl: 'http://localhost:3000',
        onProgress: (progress) => {
          setIsSyncing(progress.phase !== 'idle');
        },
      });

      sync.startContinuousSync(10000);

      return () => sync.stopContinuousSync();
    }

    init();
  }, []);

  // Load todos
  useEffect(() => {
    if (!db) return;

    async function load() {
      const allTodos = await db.find('todos');
      setTodos(allTodos);
    }

    load();

    return db.onChange((op) => {
      if (op.collection === 'todos') load();
    });
  }, [db]);

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addTodo = async () => {
    if (!db || !newTodo.trim()) return;
    await db.insert('todos', {
      text: newTodo,
      completed: false,
      createdAt: Date.now(),
    });
    setNewTodo('');
  };

  const toggleTodo = async (id, completed) => {
    if (!db) return;
    await db.update('todos', id, { completed: !completed });
  };

  const deleteTodo = async (id) => {
    if (!db) return;
    await db.delete('todos', id);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Local-First Todo App</h1>
      
      <div style={{ marginBottom: 20 }}>
        {isOnline ? '🌐 Online' : '📴 Offline'}
        {isSyncing && ' (Syncing...)'}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          style={{ width: '70%', padding: 10 }}
        />
        <button onClick={addTodo} style={{ padding: 10, marginLeft: 10 }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ 
            padding: 10, 
            borderBottom: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
            />
            <span style={{ 
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

## Step 4: Test Offline Functionality

1. Open your browser's DevTools
2. Go to the Network tab
3. Select "Offline" mode
4. Try creating/editing todos - they still work!
5. Go back online
6. Watch the data sync automatically

## Step 5: Test Multi-Client Sync

1. Open your app in two browser tabs
2. Make changes in one tab
3. See them appear in the other tab automatically!

## Common Issues

### Port 3000 already in use
```bash
# Change port in server startup
PORT=3001 npm run server:mongo
```

### MongoDB connection failed
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Or start it
sudo systemctl start mongod
```

### PostgreSQL connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or start it
sudo systemctl start postgresql
```

## Next Steps

- Read the [full documentation](./README.md)
- Explore [advanced examples](./examples/)
- Check out [performance tuning](./docs/performance.md)
- Learn about [conflict resolution strategies](./docs/conflicts.md)

## Need Help?

- Check the [FAQ](./docs/faq.md)
- Open an issue on GitHub
- Join our Discord community
