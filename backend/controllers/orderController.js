// Order Handlers

/**
 * Places a new order.
 */
const handlePlaceOrder = async (req, res, db) => {
    const user_id = req.user?.id;
    const { customer_id, total_amount, status, supplier_id, name, type, email, phone_number, products, address } = req.body;

    if (!user_id || !(customer_id || supplier_id) || !total_amount || !status || !name || !email || !phone_number || !address || !products?.length) {
        return res.status(400).json({ message: 'Invalid input. Please provide all required fields and at least one product.' });
    }

    const trx = await db.transaction();
    try {
        const [order] = await trx('orders').insert({ user_id, customer_id, supplier_id, total_amount, status, name, type, phone_number, email, address }).returning('*');
        if (!order) throw new Error('Order creation failed');

        for (const { id: product_id, quantity, price, name, sku } of products) {
            if (quantity <= 0 || price <= 0) throw new Error('Invalid product data');
            await trx('order_items').insert({ order_id: order.id, product_id, quantity, price, total_amount: quantity * price, name, sku, user_id });
        }

        await trx.commit();
        res.status(201).json(order);
    } catch (err) {
        await trx.rollback();
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};

/**
 * Retrieves all orders.
 */
const handleGetAllOrders = async (req, res, db) => {
    const user_id = req.user?.id;
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    try {
        const orders = await db('orders').where({ user_id }).select('*');
        res.status(200).json(orders.length ? orders : []);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving orders', error: err.message });
    }
};

/**
 * Retrieves order items by order ID.
 */
const handleGetOrderItems = async (req, res, db) => {
    const { order_id } = req.params;
    const user_id = req.user.id;
    if (!order_id || !user_id) return res.status(400).json({ message: 'Missing required fields' });

    try {
        const orderItems = await db('order_items').where({ user_id, order_id }).select('*');
        res.status(200).json(orderItems.length ? orderItems : { message: 'Order not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving order items', error: err.message });
    }
};

/**
 * Updates an order's status.
 */
const handleUpdateOrder = async (req, res, db) => {
    const user_id = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) return res.status(400).json({ message: 'Order ID and status required' });

    try {
        const [updatedOrder] = await db('orders').where({ user_id, id }).update({ status }).returning('*');
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

export default {
    handlePlaceOrder,
    handleGetOrderItems,
    handleGetAllOrders,
    handleUpdateOrder,
};
