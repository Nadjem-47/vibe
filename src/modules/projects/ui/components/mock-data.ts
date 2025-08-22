import { Fragment, Message } from "@/generated/prisma"

export const mockFragments: Fragment[] = [
  {
    id: "f1",
    messageId: "1",
    sandboxUrl: "https://www.wikipedia.org",
    title: "React Component Example",
    files: { 
      "App.tsx": `import React, { useState } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`,
      "App.css": `.App {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-container input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-container button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.todo-list button {
  margin-left: auto;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
      "index.ts": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
  },
  {
    id: "f2",
    messageId: "3",
    sandboxUrl: "https://www.wikipedia.org",
    title: "Next.js API Example",
    files: { 
      "pages/api/users.ts": `import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  id: number;
  name: string;
  email: string;
}

// In-memory data store
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(\`Method \${method} Not Allowed\`);
  }
}

function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const user = users.find(u => u.id === parseInt(id as string));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  }
  
  res.status(200).json(users);
}

function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const newUser: User = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
}

function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === parseInt(id as string));
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], name, email };
  res.status(200).json(users[userIndex]);
}

function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  const userIndex = users.findIndex(u => u.id === parseInt(id as string));
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).end();
}`,
      "pages/index.tsx": `import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

interface User {
  id: number;
  name: string;
  email: string;
}

const Home: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (response.ok) {
        setNewUser({ name: '', email: '' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Head>
        <title>Next.js API Example</title>
        <meta name="description" content="Next.js API example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Next.js API Example</h1>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <button type="submit">Add User</button>
        </form>

        <div className="users">
          <h2>Users</h2>
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;`,
      "package.json": `{
  "name": "nextjs-api-example",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "typescript": "^5"
  }
}`,
      "tsconfig.json": `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
    },
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
  },
  {
    id: "f3",
    messageId: "5",
    sandboxUrl: "https://www.wikipedia.org",
    title: "React Hook Example",
    files: { 
      "useCounter.ts": `import { useState, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

export const useCounter = (initialValue: number = 0): UseCounterReturn => {
  const [count, setCountState] = useState(initialValue);

  const increment = useCallback(() => {
    setCountState(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCountState(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCountState(initialValue);
  }, [initialValue]);

  const setCount = useCallback((value: number) => {
    setCountState(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  };
};`,
      "Counter.tsx": `import React from 'react';
import { useCounter } from './useCounter';

interface CounterProps {
  initialValue?: number;
  label?: string;
}

export const Counter: React.FC<CounterProps> = ({ 
  initialValue = 0, 
  label = 'Counter' 
}) => {
  const { count, increment, decrement, reset } = useCounter(initialValue);

  return (
    <div className="counter">
      <h2>{label}</h2>
      <div className="counter-display">
        <span className="count">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={decrement} className="btn btn-decrement">
          -
        </button>
        <button onClick={reset} className="btn btn-reset">
          Reset
        </button>
        <button onClick={increment} className="btn btn-increment">
          +
        </button>
      </div>
    </div>
  );
};`,
      "App.tsx": `import React from 'react';
import { Counter } from './Counter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Hook Example</h1>
      </header>
      <main>
        <div className="counters-container">
          <Counter initialValue={0} label="Basic Counter" />
          <Counter initialValue={10} label="Starting at 10" />
          <Counter initialValue={-5} label="Negative Counter" />
        </div>
      </main>
    </div>
  );
}

export default App;`,
      "App.css": `.App {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  margin-bottom: 30px;
}

.counters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.counter {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  min-width: 200px;
  background-color: #f9f9f9;
}

.counter h2 {
  margin: 0 0 15px 0;
  color: #333;
}

.counter-display {
  margin: 20px 0;
}

.count {
  font-size: 3rem;
  font-weight: bold;
  color: #007bff;
}

.counter-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-increment {
  background-color: #28a745;
  color: white;
}

.btn-increment:hover {
  background-color: #218838;
}

.btn-decrement {
  background-color: #dc3545;
  color: white;
}

.btn-decrement:hover {
  background-color: #c82333;
}

.btn-reset {
  background-color: #6c757d;
  color: white;
}

.btn-reset:hover {
  background-color: #5a6268;
}`
    },
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
  },
]

export const mockMessages: (Message & { fragment: Fragment | null })[] = [
  {
    id: "1",
    content: "Hello, how can I help you?",
    role: "ASSISTANT",
    fragment: mockFragments[0],
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
    type: "RESULT",
    projectId: "p1",
  },
  {
    id: "2",
    content: "I need help with my Next.js app.",
    role: "USER",
    fragment: null,
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
    type: "RESULT",
    projectId: "p1",
  },
  {
    id: "3",
    content: "Sure! What issue are you facing?",
    role: "ASSISTANT",
    fragment: mockFragments[1],
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
    type: "RESULT",
    projectId: "p1",
  },
  {
    id: "4",
    content: "This is error",
    role: "ASSISTANT",
    fragment: null,
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
    type: "ERROR",
    projectId: "p1",
  },
  {
    id: "5",
    content: "Here's a React hook example for you:",
    role: "ASSISTANT",
    fragment: mockFragments[2],
    createdAt: new Date("2025-10-11T00:00:00.000Z"),
    updatedAt: new Date("2025-10-11T00:00:00.000Z"),
    type: "RESULT",
    projectId: "p1",
  },
]
