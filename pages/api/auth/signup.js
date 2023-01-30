import prisma from "@prisma/index"
import { hash } from 'bcryptjs';

// api/auth/signup
async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password, firstName, lastName } = JSON.parse(req.body);
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Invalid Data' });
            return;
        }
        //Check existing
        const checkExisting = await prisma.user.findUnique({where: {email: email}});
        //Send error response if duplicate user is found
        if (checkExisting) {
            res.status(422).json({ message: 'Account already exists' });
            return;
        }
        //Hash password
        const status = await prisma.user.create({
            data: {
                email,
                password: await hash(password, 12),
                firstName,
                lastName
            }
        });
        //Send success response
        res.status(201).json({ message: 'User created', ...status });
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Route not valid' });
    }
}

export default handler;