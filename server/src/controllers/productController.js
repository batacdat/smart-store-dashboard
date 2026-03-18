import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
    try {
        let images = [];
        
        // req.files được tạo ra bởi middleware Multer
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Chuyển file buffer sang dạng base64 để upload
                const b64 = Buffer.from(file.buffer).toString("base64");
                let dataURI = "data:" + file.mimetype + ";base64," + b64;
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: "products", // Tên thư mục trên Cloudinary
                });

                images.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }

        // Gán mảng images đã upload thành công vào body trước khi lưu vào database
        req.body.images = images;

        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Lấy chi tiết một sản phẩm
export const getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm",
            });
        }

        // --- XỬ LÝ HÌNH ẢNH ---
        let images = [];

        // Nếu người dùng có gửi file mới lên (req.files từ Multer)
        if (req.files && req.files.length > 0) {
            
            // 1. Xóa ảnh cũ trên Cloudinary (Tùy chọn: Nếu bạn muốn thay thế hoàn toàn ảnh cũ)
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }

            // 2. Upload ảnh mới lên
            for (const file of req.files) {
                const b64 = Buffer.from(file.buffer).toString("base64");
                let dataURI = "data:" + file.mimetype + ";base64," + b64;
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: "smart_store_products",
                });

                images.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            
            // Gán mảng ảnh mới vào body để update
            req.body.images = images;
        } else {
            // Nếu không gửi file mới, giữ nguyên ảnh cũ trong DB
            req.body.images = product.images;
        }

        // --- CẬP NHẬT DATABASE ---
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm",
            });
        }

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id);
        }
        // Sửa từ .remove() thành .deleteOne()
        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được xóa thành công",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};