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
export const updateCategoryController  = async(req,res) =>{
    try {
        const {name} = req.body;
        const{id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true}); // new is used because if dont use it category page will not update
        res.status(200).send({
            success:true,
            message:"Category updated successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error while updating category"
        });  
    }
};

export const getCategoriesController  = async(req,res) =>{
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All categories",
            category
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in getting categories"
        });                 
    }
};

export const singleCategoryController  = async(req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Single Category",
            category
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in getting category"
        });   
    }
};

export const deleteCategoryController  = async(req,res) =>{
    try {
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success:true,
            message:"Category deleted successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in deleting category"
        });   
    }
};