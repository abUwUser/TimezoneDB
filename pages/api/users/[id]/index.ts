// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from "nextjs-cors";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { get } from '../../../../handlers/db'
import { getUsernameId } from '../../../../handlers/cache'


export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
    await NextCors(req, res, {
        origin: "*",
    })

    const { id } = req.query
    const { logintoken } = req.body

    let user = await get(id as string, Boolean(logintoken), true)

    if (Boolean(logintoken)) {
        try {
            const privatedata = jwt.verify(logintoken, process.env.JWT_SECRET as string)
            
            const isPasswordFromUser = await bcrypt.compare((privatedata as any).password, user.private.passwordHash)
            delete user.private.passwordHash
            
            if (!isPasswordFromUser || user.username !== (privatedata as any).username) {
                delete user.private
            }
        } catch (err) {
            console.error(err)
            delete user.private
        }
    }
    
    res.status(200).send(user)
}
