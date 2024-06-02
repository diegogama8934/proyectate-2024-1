import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Food from "../models/food";
import Exercise from "../models/exercise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, weight, height, age, password, gender } = req.body;

    try {
        const user = new User({
            name,
            email,
            weight,
            height,
            age,
            password,
            gender,
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export interface CustomReq extends Request {
    user: IUser;
}
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(JWT_SECRET);
    

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserInfo = async (req: CustomReq, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setUserGoal = async (req: CustomReq, res: Response) => {
    const { goal, exerciseDays } = req.body;

    try {
        // Ver si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fijar meta y días de ejercicio del usuario
        user.goal = goal;
        user.exerciseDays = exerciseDays;

        // Calculating BMR and macronutrients
        const bmr =
            user.gender === "female"
                ? 655.1 +
                  9.563 * user.weight +
                  1.85 * user.height -
                  4.676 * user.age
                : 66.5 +
                  13.75 * user.weight +
                  1.85 * user.height -
                  6.775 * user.age;

        const kcal = calculateKcal(bmr, goal, exerciseDays);
        const macros = calculateMacros(kcal, goal);

        await user.save();
        res.json({
            kcal,
            macros,
            foods: await Food.find(),
            exercises: await getExercises(goal, exerciseDays),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addFavorite = async (req: CustomReq, res: Response) => {
    console.log(req);
    const { foods, exercises } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.favorite = { foods, exercises };
        await user.save();
        res.json(user.favorite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper functions
const calculateKcal = (
    bmr: number,
    goal: string,
    exerciseDays: number
): number => {
    // Apply activity factor
    const activityFactor =
        exerciseDays === 3 ? 1.375 : exerciseDays === 4 ? 1.55 : 1.725;
    const baseKcal = bmr * activityFactor;

    switch (goal) {
        case "Disminución de peso":
            return baseKcal * 0.8; // 20% calorie reduction
        case "Hipertrofia":
        case "Aumento de fuerza":
        case "Aumento de resistencia":
            return baseKcal * 1.2; // 20% calorie increase
        case "Mantenimiento":
        default:
            return baseKcal;
    }
};

const calculateMacros = (kcal: number, goal: string) => {
    let carbRatio, fatRatio, proteinRatio;

    switch (goal) {
        case "Disminución de peso":
            carbRatio = 0.6;
            fatRatio = 0.25;
            proteinRatio = 0.15;
            break;
        case "Hipertrofia":
        case "Aumento de fuerza":
        case "Aumento de resistencia":
            carbRatio = 0.6;
            fatRatio = 0.2;
            proteinRatio = 0.2;
            break;
        case "Mantenimiento":
        default:
            carbRatio = 0.55;
            fatRatio = 0.3;
            proteinRatio = 0.15;
            break;
    }

    const carbs = (kcal * carbRatio) / 4; // grams of carbs
    const fats = (kcal * fatRatio) / 9; // grams of fats
    const proteins = (kcal * proteinRatio) / 4; // grams of proteins

    return { carbs, fats, proteins };
};

const getExercises = async (goal: string, exerciseDays: number) => {
    return await Exercise.find({ objective: goal, days: exerciseDays });
};
