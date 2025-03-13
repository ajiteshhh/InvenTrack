/**
 * Handles fetching the recent activity of a user from the database.
 */
const handleGetRecentActivity = async (req, res, db) => {
    // Extract user ID from the request object (if available)
    const user_id = req.user?.id;

    try {
        // Fetch recent activity data for the authenticated user
        const recentActivity = await db('recent_activity')
            .where({ user_id }) // Filter records by user_id
            .select('*'); // Select all columns

        // Send the retrieved data as a JSON response
        res.status(200).json(recentActivity);
    } catch (err) {
        // Handle any errors and send an appropriate response
        res.status(500).json({
            message: 'Error getting recent activity',
            error: err.message, // Send detailed error message
        });
    }
};

// Export the function as part of an object for use in other files
export default {
    handleGetRecentActivity,
};
