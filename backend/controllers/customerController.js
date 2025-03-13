/**
 * Adds a new customer for the authenticated user.
 */
const handleAddCustomer = async (req, res, db) => {
    const { name, email, phone, address } = req.body;
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'All fields are required', name, email, phone });
    }

    try {
        const [customer] = await db('customers')
            .insert({ name, email, phone, user_id, address })
            .returning('*');

        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Error adding customer', error: err.message });
    }
};

/**
 * Updates an existing customer for the authenticated user.
 */
const handleUpdateCustomer = async (req, res, db) => {
    const { name, email, phone, address } = req.body;
    const user_id = req.user.id;
    const { customer_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Check if the customer exists and belongs to the user
        const customer = await db('customers')
            .where({ user_id, id: customer_id })
            .first();

        if (!customer) {
            return res.status(404).json({ message: 'Customer Not Found or Access Denied' });
        }

        // Update the customer
        const [updatedCustomer] = await db('customers')
            .where({ user_id, id: customer_id })
            .update({ name, email, phone, address })
            .returning('*');

        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(500).json({ message: 'Error updating customer', error: err.message });
    }
};

/**
 * Retrieves all customers for the authenticated user, including their latest order details.
 */
const handleGetAllCustomers = async (req, res, db) => {
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const customers = await db('customers as c')
            .leftJoin(
                db('orders as o')
                    .select(
                        db.raw('COUNT(o.order_id) OVER (PARTITION BY o.customer_id) AS total_orders'),
                        db.raw('SUM(o.total_amount) OVER (PARTITION BY o.customer_id) AS total_value'),
                        'o.customer_id',
                        'o.order_id',
                        'o.created_at',
                        'o.total_amount',
                        'o.status'
                    )
                    .distinctOn('o.customer_id')
                    .orderBy('o.customer_id')
                    .orderBy('o.created_at', 'desc')
                    .as('o'),
                'c.id',
                'o.customer_id'
            )
            .where('c.user_id', user_id)
            .select(
                'c.*',
                'o.order_id as latest_order_id',
                'o.created_at as latest_order_date',
                'o.total_amount as latest_total_amount',
                'o.status as latest_status'
            );

        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving customers', error: err.message });
    }
};

/**
 * Deletes a customer for the authenticated user.
 */
const handleDeleteCustomer = async (req, res, db) => {
    const user_id = req.user.id;
    const { customer_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!customer_id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        const customer = await db('customers')
            .where({ user_id, id: customer_id })
            .first();

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await db('customers')
            .where({ user_id, id: customer_id })
            .del();

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
};

export default {
    handleAddCustomer,
    handleGetAllCustomers,
    handleUpdateCustomer,
    handleDeleteCustomer,
};
