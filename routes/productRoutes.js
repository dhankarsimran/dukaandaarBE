import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
    createProductController ,
    getProductsController, 
    singleProductController , 
    getPhotoController ,
    deleteProductController,
    updateProductController
    } from '../controllers/productController.js';
import formidable from 'express-formidable';
const router = express.Router();

//routes
// create-product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);

// get all products
router.get('/get-product',getProductsController);

// get single product
router.get('/get-product/:slug',singleProductController);

// get photo
router.get('/product-photo/:pid',getPhotoController);

// delete product
router.delete("/product/pid",deleteProductController);

// update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);

// router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController);
export default router;