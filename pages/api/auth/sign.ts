import type { NextApiRequest, NextApiResponse } from 'next'
import { create } from '../../../handlers/db'
import bcrypt from "bcrypt"
import { getUsernameId } from '../../../handlers/cache'
import jwt from "jsonwebtoken"
// import { contains } from '../../../handlers/ambiguition'

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if(req.method !== 'POST') return

    const {
        username,
        password
    } = req.body

    if (!username || !password) return res.status(400).send('Missing username or password')

    if (await getUsernameId(username)) return res.status(400).send('Already has an existing username')

    const token = jwt.sign({username, password}, process.env.JWT_SECRET as string, {expiresIn: '30d'})

    await create({
        username,
        private: {
            passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10))
        }
    })

    res.status(200).send(null)

    // const userId = await create({
    //     username: "Jalad",
    //     private: {
    //         passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10))
    //     }
    // })
}