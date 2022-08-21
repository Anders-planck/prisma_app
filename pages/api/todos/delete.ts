import { PrismaClient, Todo } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != "DELETE") {
        return res.status(405).json({ message: "Method not allowed !" })
    }

    const todoData: Todo = JSON.parse(req.body)

    const deleteData = await prisma.todo.delete({
        where: { id: todoData.id },
    })

    res.json(deleteData)
}
