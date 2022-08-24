import { Prisma, Todo } from "@prisma/client"
import { useState } from "react"

interface Props {
    todo: Todo,
    saveElementEdit: (todoEdit: Todo) => void,
    deleteTodoElement: (todoEl: Todo) => void
}

async function savetodoEdit(todo: Prisma.TodoUpdateInput) {
    const response = await fetch("/api/todos/edit",{
        method:"PUT",
        body: JSON.stringify(todo)
    })
    if(!response.ok) throw new Error(response.statusText)
    return await response.json()
}

async function deletetodoElement(todo: Prisma.TodoUpdateInput) {
    const response = await fetch("/api/todos/delete", {
        method: "DELETE",
        body: JSON.stringify(todo)
    })
    if (!response.ok) throw new Error(response.statusText)
    return await response.json()
}



const TodoComponent: React.FC<Props> = ({ todo, saveElementEdit, deleteTodoElement }) => {
    const [edit, setEdit] = useState<boolean>(false)
    const [editTodo, setEditTodo] = useState<string>(todo.content)

    async function saveTodo (){
        try {
            const s:Todo = await savetodoEdit({id:todo.id,content:editTodo})
            saveElementEdit(s)
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteTodo() {
        try {
            await deletetodoElement({ id: todo.id, content: editTodo })
            deleteTodoElement(todo)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
        <div onDoubleClick={() => setEdit(true)} className={`p-2  w-full  border-2 shadow-sm my-2 overflow-hidden  ${!edit ? "flex justify-between items-center flex-wrap" : ""}`}>
            <div className="flex justify-start items-center p-2">
                {!edit ?
                    <div className="flex flex-col">
                        <span className="font-black break-words"><mark>{todo.id}</mark>__</span>
                        <p>{todo.content}</p>
                    </div>
                    : <input
                        type="text"
                        className="w-full bg-gray-100 rounded p-2 mr-4 border focus:outline-none focus:border-blue-500"
                        value={editTodo}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                console.log('Enter key pressed ✅');
                                saveTodo()
                                setEdit(false)
                            }
                        }}
                        onChange={(e) => setEditTodo(e.target.value)}
                    />}
            </div>
            {!edit &&
                <div className=" flex justify-end items-center space-x-2">
                    <span onClick={deleteTodo} className="text-white text-sm  uppercase px-4 py-2 mx-2 bg-red-600 rounded font-bold cursor-pointer">delete</span>
                </div>
            }

        </div>
        </>
    )
}


export default TodoComponent