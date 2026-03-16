import mongoose from "mongoose";    
const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Vui lòng nhập tên sản phẩm"],
            trim:true,
        },
        description:{
            type:String,
            required:[true, "Vui lòng nhập mô tả sản phẩm"],
        },
        price:{
            type:Number,
            required:[true, "Vui lòng nhập giá sản phẩm"],
        },
        category:{
            type:String,
            required:[true, "Vui lòng nhập danh mục sản phẩm"],
        },
        stock:{
            type:Number,
            required:[true, "Vui lòng nhập số lượng tồn kho"],
            default:0,
        },
        images:[
            {
                public_id:{
                    type:String,
                    required:true,
                },
                url:{
                    type:String,
                    required:true,
                },
            }
        ],
        isFeatured:{
            type:Boolean,
            default:false,
        },
    },
    {
        timestamps:true,
    }
);
const Product = mongoose.model("Product", productSchema);
export default Product;