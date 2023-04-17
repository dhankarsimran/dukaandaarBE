import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";
export const createProductController  = async(req,res) =>{
    try {
        const {name,slug,price,description,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name:
                return res.status(400).send({error:"Name is required"});
            case !price:
                return res.status(400).send({error:"Price is required"});
            case !description:
                return res.status(400).send({error:"Description is required"});
            case !category:
                return res.status(400).send({error:"Category is required"});
            case !quantity:
                return res.status(400).send({error:"Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(400).send({error:"Photo is required and should be less than 1mb"});
        }
        const products = new productModel({...req.fields,slug:slugify(name)});
        if(photo){
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product created successfully",
            products
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in creating Product"
        });
    }
}

// get all products
export const getProductsController  = async(req,res) =>{
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:"All products",
            products
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in getting products"
        });  
    }
};

// get single product
export const singleProductController  = async(req,res) =>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo")
        .populate('category');
        res.status(200).send({
            success:true,
            message:"Single product",
            product
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in getting product"
        });      
    }
};

// get photo
export const getPhotoController  = async(req,res) =>{
    try {
        const product = await productModel.findOne({_id:req.params.pid}).select("photo");
        if(product.photo.data){
            res.set("Content-Type",product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in getting photo of product"
        });
    }
};

// delete product
export const deleteProductController  = async(req,res) =>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Product deleted successfully"
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in deleting product"
        });  
    }
};

// update product
export const updateProductController  = async(req,res) =>{
    try {
        const {name,slug,price,description,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name:
                return res.status(400).send({error:"Name is required"});
            case !price:
                return res.status(400).send({error:"Price is required"});
            case !description:
                return res.status(400).send({error:"Description is required"});
            case !category:
                return res.status(400).send({error:"Category is required"});
            case !quantity:
                return res.status(400).send({error:"Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(400).send({error:"Photo is required and should be less than 1mb"});
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true});
        if(photo){
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product updated successfully",
            products
        });   
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:"Error in deleting product"
        });     
    }
};