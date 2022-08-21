import { PrismaClient, Todo } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != "PUT") {
        return res.status(405).json({ message: "Method not allowed !" })
    }

    const todoData:Todo = JSON.parse(req.body)

    const saveTodo = await prisma.todo.update({
        where: {id: todoData.id},
        data: {content: todoData.content}
    })

    res.json(saveTodo)
}
