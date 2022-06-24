import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import UserModel from './models/user.js';
import checkAuth from './utils/checkAuth.js';
import { registerValidation} from './validations/auth.js';
import { validationResult } from 'express-validator';
import { password } from './passwords.js';


mongoose
    .connect('mongodb+srv://nibezo:' + password + '@cluster0.ociy4ls.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB is OK'))
    .catch((err) => console.log('DB error: ', err))

const app = express();
app.use(express.json());
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "User not found!",
            })
        };

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        
        if (!isValidPass) {
            return res.status(403).json({
                message: "Password don't correct!!",
            })            
        };
        const token = jwt.sign({
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d',
        }
        );
        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Sorry, we can not auth you!',

        });
    };
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatar,
            passwordHash,
        })
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d',
        }
        )
        
        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Sorry, we can not reg you',

        })
    }
});

app.get('/auth/me', checkAuth, (req, res) => {
    try {

    } catch (err) {}
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});