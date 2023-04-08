import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController  = async(req,res) =>{
    try {
        const {name} = req.body;
        if(!name) return res.status(400).send({success:false,message:"Name is required"});
        
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory) return res.status(200).send({
            success:true,
            message:"Category already exists"
        });
        const category = await new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"Category created successfully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in Category"
        });
    }
};