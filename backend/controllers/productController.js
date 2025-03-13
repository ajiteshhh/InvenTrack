/**
 * Adds a new product to the database
 */
const handleAddProduct = async (req, res, db) => {
    // Extract product properties from request body
    const { name, description, sku, price, quantity_in_stock, low_stock, category_id } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!name || !sku || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Insert new product into database and return the created product
        const [product] = await db('products').insert({
            user_id,
            name,
            description,
            sku,
            price,
            quantity_in_stock,
            low_stock,
            category_id,
        }).returning('*');

        // Check if product is low in stock and create activity record if needed
        if (product.quantity_in_stock <= product.low_stock) {
            const activity = await db('recent_activity').insert({
                user_id,
                activity_type: 'Low Stock',
                related_id: product.id,
                description: `Low stock alert - ${product.name} (SKU: ${product.sku})`,
            });

            if (!activity) {
                return res.status(500).json({ message: 'Error adding recent activity' });
            }
        }

        // Return the created product with 202 Accepted status
        res.status(202).json(product);
    } catch (err) {
        // Handle database errors
        res.status(500).json({ message: 'Error adding product', error: err.message });
    }
};

/**
 * Retrieves all products for the authenticated user
 */
const handleGetAllProducts = async (req, res, db) => {
    const user_id = req.user.id;

    // Validate user ID
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Query database for all products belonging to the user
        const products = await db('products').where({ user_id }).select('*');
        res.status(200).json(products);
    } catch (err) {
        // Handle database errors
        res.status(500).json({ message: 'Error getting products', error: err.message });
    }
};

/**
 * Retrieves a single product by ID for the authenticated user
 */
const handleGetProductById = async (req, res, db) => {
    const user_id = req.user.id;
    const { product_id } = req.params;

    // Validate required parameters
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!product_id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        // Query database for specific product belonging to the user
        const product = await db('products').where({ user_id, id: product_id }).first();

        // Handle case where product doesn't exist or doesn't belong to user
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        // Handle database errors
        res.status(500).json({ message: 'Error getting product', error: err.message });
    }
};

/**
 * Updates an existing product in the database
 */
const handleUpdateProduct = async (req, res, db) => {
    const { id } = req.params;
    const { name, description, sku, price, quantity_in_stock, low_stock, category_id } = req.body;
    const user_id = req.user.id;

    // Validate required parameters and fields
    if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!name || !sku || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if SKU already exists for another product
        const existingSku = await db('products').where({ sku }).andWhere('id', '<>', id).first();

        if (existingSku) {
            return res.status(400).json({ message: 'SKU already exists' });
        }

        // Verify product exists and belongs to user
        const product = await db('products').where({ id }).first();

        if (!product || product.user_id !== user_id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update product in database and return updated product
        const [updatedProduct] = await db('products').where({ id }).update({
            name,
            description,
            sku,
            price,
            quantity_in_stock,
            low_stock,
            category_id,
        }).returning('*');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if updated product is low in stock and create activity record if needed
        if (updatedProduct.quantity_in_stock <= updatedProduct.low_stock) {
            const activity = await db('recent_activity').insert({
                user_id,
                activity_type: 'Low Stock',
                related_id: updatedProduct.id,
                description: `Low stock alert - ${updatedProduct.name} (SKU: ${updatedProduct.sku})`,
            });

            if (!activity) {
                return res.status(500).json({ message: 'Error adding recent activity' });
            }
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        // Handle database errors
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
};

/**
 * Deletes a product from the database
 */
const handleDeleteProduct = async (req, res, db) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    try {
        // Verify product exists and belongs to user
        const product = await db('products').where({ id: product_id }).first();

        if (!product || product.user_id !== user_id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Delete product from database
        const rowsDeleted = await db('products').where({ id: product_id }).del();

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        // Handle database errors
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
};

export default {
    handleAddProduct,
    handleGetAllProducts,
    handleGetProductById,
    handleUpdateProduct,
    handleDeleteProduct,
};