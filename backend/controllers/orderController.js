/**
 * Handles placing a new order (sales or purchase)
 */
const handlePlaceOrder = async (req, res, db) => {
    const user_id = req.user?.id;
    const { customer_id, total_amount, status, supplier_id, name, type, email, phone_number, products, address } = req.body;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (type !== "Sales" && type !== "Purchase") {
        return res.status(400).json({ message: 'Invalid order type. Must be "Sales" or "Purchase".' });
    }

    if (!(customer_id || supplier_id)) {
        return res.status(400).json({ message: 'Either customer_id or supplier_id is required.' });
    }

    for (const product of products) {
        if (!product.id || !product.quantity || product.quantity <= 0 || product.price <= 0) {
            return res.status(400).json({ message: 'Each product must have a valid id, quantity > 0, and price > 0.' });
        }
    }

    const trx = await db.transaction();
    try {
        const [order] = await trx('orders')
            .insert({
                user_id,
                customer_id: customer_id || null,
                supplier_id: supplier_id || null,
                total_amount,
                status,
                name,
                type,
                phone_number,
                email,
                address,
            })
            .returning('*');

        if (!order) {
            throw new Error('Order creation failed');
        }

        const productList = [];
        for (const product of products) {
            const { id: product_id, quantity, price, name, sku } = product;
            const total_amount = quantity * price;
            const [orderItem] = await trx('order_items')
                .insert({
                    order_id: order.id,
                    product_id,
                    quantity,
                    price,
                    total_amount,
                    name,
                    sku,
                    user_id,
                })
                .returning('*');

            if (!orderItem) {
                throw new Error(`Failed to create order item for product ID: ${product_id}`);
            }

            if (type === "Sales") {
                const productStock = await trx('products').where({ id: product_id }).select('quantity_in_stock').first();
                if (!productStock || productStock.quantity_in_stock < quantity) {
                    throw new Error(`Insufficient stock for product ID: ${product_id}`);
                }
                const updatedStock = await trx('products')
                    .where({ id: product_id })
                    .decrement('quantity_in_stock', quantity)
                    .returning('*');
                const updatedProduct = updatedStock[0];

                if(updatedProduct.quantity_in_stock <= updatedProduct.low_stock) {
                    const activity = await db('recent_activity').insert({
                        user_id,
                        activity_type: 'Low Stock',
                        related_id: updatedProduct.id,
                        description: `Low stock alert - ${updatedProduct.name}(SKU: ${updatedProduct.sku})`,
                    });
                    if(!activity) {
                        return res.status(500).json({ message: 'Error adding recent activity' });
                    }
                }
            } else if (type === "Purchase") {
                await trx('products').where({ id: product_id }).increment('quantity_in_stock', quantity);
            }

            productList.push(orderItem);
        }

        await trx.commit();
        res.status(201).json(order);

        const activity = await db('recent_activity').insert({
            user_id,
            activity_type: 'New Order',
            related_id: order.id,
            description: `New order${order.customer_id ? ' received' : ''} - #${order.order_id}`,
        });
        if(!activity) {
            return res.status(500).json({ message: 'Error adding recent activity' });
        }
    } catch (err) {
        await trx.rollback();
        console.error('Error placing order:', err.stack);
        res.status(500).json({
            message: customer_id
                ? 'Error creating sales order'
                : 'Error creating purchase order',
            error: err.message,
        });
    }
};

/**
 * Retrieves all items for a specific order
 */
const handleGetOrderItems = async (req, res, db) => {
    const { order_id } = req.params;
    const user_id = req.user.id;
    if(!order_id) {
        return res.status(400).json({ message: 'Order ID is required' });
    }
    if(!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const orderItems = await db('order_items')
            .where({ user_id, order_id })
            .select('*');
        if (orderItems.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(orderItems);
    } catch (err) {
        res.status(500).json({ message: 'Error getting order items', error: err.message });
    }
};

/**
 * Retrieves all orders for the authenticated user
 */
const handleGetAllOrders = async (req, res, db) => {
    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const orders = await db('orders')
            .where({ user_id })
            .select('*');

        if (orders.length === 0) {
            return res.status(404).json([]);
        }
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error getting orders', error: err.message });
    }
};

/**
 * Updates an order's status and logs the activity
 */
const handleUpdateOrder = async (req, res, db) => {
    const user_id = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;
    if(!id || !status ) {
        return res.status(400).json({ message: 'Order ID and Status is required' });
    }
    try {
        const order = await db('orders').where({ user_id, id }).first();
        if(!order) {
            return res.status(404).json({ message: 'Order Not Found' });
        }

        const [updatedOrder] = await db('orders').where({ user_id, id }).update({
            status,
        }).returning('*');

        const activity = await db('recent_activity').insert({
            user_id,
            activity_type: `Order ${status}`,
            related_id: order.id,
            description: `Order ${status} - #${order.order_id}`,
        });
        if(!activity) {
            return res.status(500).json({ message: 'Error adding recent activity' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

export default{
    handlePlaceOrder,
    handleGetOrderItems,
    handleGetAllOrders,
    handleUpdateOrder,
};