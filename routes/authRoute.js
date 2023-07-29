import express from 'express';
import { forgotPasswordController, getAllOrdersController, getOrdersController, loginController, orderStatusController, registerController, testController, updateProfileController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
// router object
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post('/signup',registerController);

//LOGIN || POST
router.post('/login',loginController);

// forgot password || POST
router.post('/forgotpassword',forgotPasswordController);

// test routes
router.get('/test',testController);

//protected route auth for normal user
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    });
});

//protected route auth for admin
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    });
});

// update profile
router.put("/profile",requireSignIn,updateProfileController);

//orders
router.get("/orders",requireSignIn,getOrdersController);

//all-orders
router.get("/all-orders",requireSignIn,isAdmin,getAllOrdersController);

//order status update
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);

export default router;