/**
 * Creates a new supplier in the database
 */
const handleAddSupplier = async (req, res, db) => {
    // Extract data from request
    const { name, email, phone, address, status, category_id } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if(!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!name || !email || !phone || !address || !status || !category_id) {
        return res.status(400).json({ message: 'Wrong Submission' });
    }

    try {
        // Insert new supplier into database and return created supplier
        const [supplier] = await db('suppliers').insert({
            name,
            user_id,
            email,
            phone,
            address,
            status,
            category_id
        }).returning('*');

        // Return success with created supplier
        res.status(201).json(supplier);
    } catch (err) {
        // Return error response
        res.status(500).json({ message: 'Error adding supplier', error: err.message });
    }
};

/**
 * Retrieves all suppliers for the authenticated user with additional order statistics
 * @param {Object} req - Express request object with user info in req.user
 * @param {Object} res - Express response object
 * @param {Object} db - Database connection object
 * @returns {Object} JSON response with array of suppliers and their order data
 */
const handleGetAllSuppliers = async (req, res, db) => {
    // Optional chaining to safely extract user ID
    const user_id = req.user?.id;

    // Validate user ID
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Complex query to get suppliers with their latest order information
        // and aggregate statistics (total orders and value)
        const suppliers = await db('suppliers as s')
            .leftJoin(
                // Subquery to get the latest order for each supplier
                db('orders as o')
                    .select(
                        db.raw('COUNT(o.order_id) OVER (PARTITION BY o.supplier_id) AS total_orders'), // Total number of orders per supplier
                        db.raw('SUM(o.total_amount) OVER (PARTITION BY o.supplier_id) AS total_value'), // Total value of orders per supplier
                        'o.supplier_id', // Needed for join condition
                        'o.order_id', // Custom ID like 'ORD-1001'
                        'o.created_at', // Latest order date
                        'o.total_amount', // Latest total amount
                        'o.status' // Latest order status
                    )
                    .distinctOn('o.supplier_id') // Get only the latest order for each supplier
                    .orderBy('o.supplier_id')
                    .orderBy('o.created_at', 'desc')
                    .as('o'),
                's.id', // Join condition
                'o.supplier_id'
            )
            .where('s.user_id', user_id) // Filter suppliers by user_id
            .select(
                's.*', // All supplier columns
                'o.order_id as latest_order_id', // Latest order ID
                'o.created_at as latest_order_date', // Latest order date
                'o.total_amount as latest_total_amount', // Latest order total amount
                'o.status as latest_status', // Latest order status
                db.raw('SUM(o.total_amount) OVER (PARTITION BY o.supplier_id) AS total_value'), // Total order value
                db.raw('COUNT(o.order_id) OVER (PARTITION BY o.supplier_id) AS total_orders') // Total orders
            );

        // Return empty array instead of 404 if no suppliers found
        if (suppliers.length === 0) {
            return res.status(404).json([]/*{ message: 'No suppliers found' }*/);
        }

        // Return suppliers with their order data
        res.status(200).json(suppliers);
    } catch (err) {
        // Return error response
        res.status(500).json({
            message: 'Error retrieving suppliers with latest orders',
            error: err.message
        });
    }
};

/**
 * Updates an existing supplier in the database
 */
const handleUpdateSupplier = async (req, res, db) => {
    const { id } = req.params;
    const { name, email, phone, address, status, category_id } = req.body;
    const user_id = req.user.id;

    // Validate user ID
    if(!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Verify supplier exists and belongs to user
        const supplier = await db('suppliers')
            .where({ user_id, id })
            .first();
        if (!supplier || supplier.user_id !== user_id) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Update supplier in database
        const[updatedSupplier] = await db('suppliers')
            .where({ user_id, id})
            .update({
                name,
                email,
                phone,
                address,
                status,
                category_id
            }).returning('*');

        // Handle case where supplier wasn't found or update failed
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier Not Found' });
        }

        // Return updated supplier
        res.status(200).json(updatedSupplier);
    } catch (err) {
        // Return error response
        res.status(500).json({ message: 'Error updating supplier', error: err.message });
    }
};

/**
 * Deletes a supplier from the database
 */
const handleDeleteSupplier = async (req, res, db) => {
    const { id } = req.params;
    const user_id = req.user.id;

    // Validate user ID
    if(!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Verify supplier exists and belongs to user
        const supplier = await db('suppliers')
            .where({ user_id, id })
            .first();

        if (!supplier || supplier.user_id !== user_id) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Delete supplier from database
        const rowsDeleted = await db('suppliers')
            .where({ user_id, id })
            .del();

        // Handle case where supplier wasn't found or delete failed
        if (rowsDeleted === 0) {
            return res.status(404).json({ message: 'Supplier Not Found' });
        }

        // Return success message
        res.status(200).json({ message: 'Supplier Deleted' });
    } catch (err) {
        // Return error response
        res.status(500).json({ message: 'Error deleting supplier', error: err.message });
    }
};

export default {
    handleAddSupplier,
    handleGetAllSuppliers,
    handleUpdateSupplier,
    handleDeleteSupplier
};