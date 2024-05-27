import { Request, Response } from "express";
import { dbConnection } from "../config/config";
import UserModels from "../models/user";

const registerUser = async (req: Request, res: Response) => {
    const user = new UserModels.User(req.body);
    try {
        await user
            .save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch {
        res.status(500).json({ message: "Error al intentar crear usuario." });
    }
};

const login = async (req: Request, res: Response) => {
    await UserModels.UserLogin.findOne({ email: req.body.email })
        .where("password")
        .equals(req.body.password)
        .then((data) => {
            if (!data)
                res.json({
                    message: "No existe un usuario con esos datos",
                    data,
                });
            res.json({ message: "OK", data });
            console.log(data);
        })
        .catch((error) => res.json({ message: error }));
};

const updateUser = async (req: Request, res: Response) => {
    const { user, password, height, weight, age, gender } = req.body;

    dbConnection;
};

export default { registerUser, login, updateUser };
