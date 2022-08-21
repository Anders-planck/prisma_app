import { Prisma, PrismaClient, Todo } from '@prisma/client'
import { debug } from 'console'
import React, { useState } from 'react'
import TodoComponent from '../components/TodoComponent'

const prima = new PrismaClient()

export async function getServerSideProps() {
  const initialTodos: Todo[] = await prima.todo.findMany()

  return {
    props: { initialTodos: initialTodos },
  }
}

interface Props {
  initialTodos: Todo[]
}

async function savaTodo(todo: Prisma.TodoCreateInput) {
  const response = await fetch("/api/todos/add", {
    method: "POST",
    body: JSON.stringify(todo)
  })

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json()
}


const Home: React.FC<Props> = ({ initialTodos }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [todo, setTodo] = useState<string>('')

  const saveElementEdit = (todoEdit: Todo) => {
    setTodos(todos.map(todo => {
      if (todo.id == todoEdit.id) todo.content = todoEdit.content
      return todo
    }))
  }

  const deleteTodoElement = (todoEl: Todo) => {
    setTodos(todos.filter(todo => todo.id != todoEl.id ))
  }



  async function AddTodo() {
    try {
      if(todo == '' || todo.length == 0) return
      const s: Todo = await savaTodo({ id: undefined, content: todo });
      setTodos([{ ...s }, ...todos])
      setTodo('');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full lg:w-1/2 lg:mx-auto my-8 p-4 overflow-hidden" >
      <h1 className=" font-extrabold text-3xl underline underline-offset-4 decoration-indigo-900 mb-8">TODO</h1>
      <div className="flex">
        <input
          type="text"
          className="w-full bg-gray-100 rounded p-2 mr-4  border focus:outline-none focus:border-blue-500"
          placeholder="write your message here..."
          value={todo}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              console.log('Enter key pressed ✅');
              AddTodo()
            }
          }}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          className="bg-slate-300 px-4 rounded-sm"
          onClick={AddTodo}
        >
          save
        </button>
      </div>

      <div className="flex flex-col-reverse justify-start items-start mt-10">
        {todos.map((t: Todo, index: number) => (
          <TodoComponent
            key={index}
            todo={t}
            saveElementEdit={saveElementEdit}
            deleteTodoElement={deleteTodoElement} />
        ))}
      </div>
    </div>
  )
}

export default Home
