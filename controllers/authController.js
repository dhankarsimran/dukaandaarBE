 import userModel from "../models/userModel.js";
 import { comparePassword, hashPassword } from "../helpers/authHelper.js";
 import JWT from "jsonwebtoken";

 export const  registerController =async (req,res)=> {
        try {
            const {name, email, password,phone,address,answer} = req.body;
            if(!name || !email || !password || !phone || !address || !answer){
                return res.send({
                    message: "Please enter all fields"
                })
            }

            // check user
            const existingUser = await userModel.findOne({email:email});

            // check existing user
            if(existingUser){
                console.log(existingUser);
                return res.status(200).send({
                    success:false,
                    message:"User already exists,Please Login"
                })
            }
            // create new user (register user)
            const hashedPassword = await hashPassword(password);
            // save
            const user = await new userModel({name, email, password:hashedPassword,phone,address,answer}).save();
            res.status(201).send({
                success: true,
                message: "User Registered Successfully",
                user
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error in Registration",
                error
            })
        }
};

//POST LOGIN
export const loginController = async(req,res)=>{
        try {
            const {email,password} = req.body;
            if(!email || !password){
                return res.send({
                    message: "Please enter all fields"
                })
            }
            // validate
            if(!email || !password){
                return res.status(404).send({
                    success: false,
                    message: "Invalid email or password"
                })
            }

            //check user
            const user = await userModel.findOne({email:email});
            if(!user){
                return res.status(404).send({
                    success: false,
                    message: "Email not registered"
                })
            }
            // check password
            const match = await comparePassword(password, user.password);
            if(!match){
                return res.status(404).send({
                    success: false,
                    message: "Invalid password"
                })
            }
            // generate token
            const token = await JWT.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
            res.status(200).send({
                success: true,
                message: "Login Success",
                user:{
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                },
                token
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error in Login",
                error
            })
        }
};

// forgot password
export const forgotPasswordController = async(req,res)=>{
    try {
        const {email,answer,newPassword} = req.body;
        if(!email){
            res.status(400).send({message:"Email is required"});
        }
        if(!answer){
            res.status(400).send({message:"answer is required"});
        }
        if(!newPassword){
            res.status(400).send({message:"New Password is required"});
        }
        // check 
        const user = await userModel.findOne({email,answer});
        //validation
        if(!user){
            res.status(404).send({success:false ,message:"Invalid Email or answer"});
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success: true,
            message: "Password Updated Successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
};

// test controller
export const testController = (req,res)=>{
        res.send('Protected Route');
}

