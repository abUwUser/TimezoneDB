// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt"
import { getID } from '../../handlers/cache'
import { create, get, remove } from '../../handlers/db'
import mergeDeep from '../../utils/mergeDeep'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const salt = await bcrypt.genSalt(10);
    const password = "456"

    const userId = await create({
        username: "Jalad",
        ids: {
            "discord": "666"
        },
        private: {
            passwordHash: await bcrypt.hash(password, salt)
        }
    })

    res.send("Ok")
}