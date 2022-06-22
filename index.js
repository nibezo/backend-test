import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from './models/user.js'
import { registerValidation} from './validations/auth.js';
import { validationResult } from 'express-validator';
import { password } from './passwords.js'

mongoose
    .connect('mongodb+srv://nibezo:' + password + '@cluster0.ociy4ls.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB is OK'))
    .catch((err) => console.log('DB error: ', err))

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, world!');
})

app.post('/auth/register', registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatar,
        passwordHash: req.body.avatarUrl,
    })

    res.json({
        success: true,
    })
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});