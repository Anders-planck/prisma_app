import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default  async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method!="POST" ) {
    return  res.status(405).json({message: "Method not allowed !"})
  }

  const todoData = JSON.parse(req.body)

  const saveTodo = await prisma.todo.create({
    data: todoData
  })

  res.json(saveTodo)
}
