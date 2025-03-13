/**
 * Adds a new category for the authenticated user.
 */
const handleAddCategory = async (req, res, db) => {
    const user_id = req.user.id;
    const { name } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const [category] = await db('categories')
            .insert({ name, user_id })
            .returning('*');

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: 'Error adding category', error: err.message });
    }
};

/**
 * Updates an existing category for the authenticated user.
 */
const handleUpdateCategory = async (req, res, db) => {
    const user_id = req.user.id;
    const { category_id } = req.params;
    const { name } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    if (!category_id || category_id.length !== 6) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    try {
        const category = await db('categories')
            .where({ user_id, category_id })
            .first();

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const [updatedCategory] = await db('categories')
            .where({ user_id, category_id })
            .update({ name })
            .returning('*');

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: 'Error updating category', error: err.message });
    }
};

/**
 * Retrieves all categories for the authenticated user.
 */
const handleGetAllCategories = async (req, res, db) => {
    const user_id = req.user.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const categories = await db('categories')
            .where({ user_id })
            .select('*');

        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving categories', error: err.message });
    }
};

/**
 * Retrieves all products for a given category of the authenticated user.
 */
const handleGetCategoryProducts = async (req, res, db) => {
    const user_id = req.user.id;
    const { category_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!category_id || category_id.length !== 6) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    try {
        const category = await db('categories')
            .where({ user_id, category_id })
            .first();

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const products = await db('products')
            .where({ user_id, category_id })
            .select('*');

        res.status(200).json({ category, products });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving category products', error: err.message });
    }
};

/**
 * Deletes a category for the authenticated user.
 */
const handleDeleteCategory = async (req, res, db) => {
    const user_id = req.user.id;
    const { category_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!category_id || category_id.length !== 6) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }

    try {
        const category = await db('categories')
            .where({ user_id, category_id })
            .first();

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await db('categories')
            .where({ user_id, category_id })
            .del();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
};

export default {
    handleAddCategory,
    handleGetAllCategories,
    handleGetCategoryProducts,
    handleUpdateCategory,
    handleDeleteCategory,
};
