import cloudinary from "cloudinary";
import {uploadToCloudinary} from "../config/cloudinary.js";
import {getBody} from "./otpTemplate.js";

const handleGenerateToken = async (req, res, db, jwt, jwtSecret) => {
    const { email } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    const token = createCookie(user, res, jwt, jwtSecret);
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });
    return res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            profile_picture: user.profile_picture,
            business_name: user.business_name,
            business_address: user.business_address,
            business_logo: user.business_logo,
            tfa_enabled: user.tfa_enabled,
        }
    });
};

const createCookie = (user, res, jwt, jwtSecret) => {
    const tokenPayload = {
        id: user.id,
        email: user.email,
        phone_number: user.phone_number,
        name: user.name,
        profile_picture: user.profile_picture,
        business_name: user.business_name,
        business_address: user.business_address,
        business_logo: user.business_logo,
        tfa_enabled: user.tfa_enabled,
    };

    return jwt.sign(tokenPayload, jwtSecret, { expiresIn: '10h' });
};

const handleRegister = async (req, res, db, bcrypt, saltRounds, jwt, jwtSecret) => {
    const { name, email, password, phone, business_name, business_logo, business_address } = req.body;

    if (!name || !email || !password || !phone || !business_name) {
        return res.status(400).json({ message: 'Missing required fields: Name, Email, Password, Phone, and Business Name are mandatory.' });
    }

    try {
        const existingUser = await db('users').select('*').where({ email }).first();
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) reject(err);
                else resolve(hash);
            });
        });

        const [user] = await db('users')
            .insert({
                name,
                email,
                password_hash: hash,
                verified: false, // Users start as unverified
                phone_number: phone,
                business_name,
                business_logo: business_logo || null, // Optional
                business_address: business_address || null, // Optional
            })
            .returning('*'); // Fetch inserted user
        res.status(201).json({
            message: 'User registered successfully. Please verify your email to activate your account.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                verified: user.verified,
            },
        });
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const handleSignIn = async (req, res, db, bcrypt, jwt, jwtSecret) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid submission: Email and Password are required' });
    }

    try {
        // Fetch user based on email
        const user = await db('users').select('*').where({ email }).first();

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        // Check if user is verified
        if (!user.verified) {
            return res.status(403).json({ message: 'Unverified Account' });
        }

        // Compare hashed password with the stored password
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Password comparison failed. Please try again later.' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
            }
            if(!user.tfa_enabled) {
                const token = createCookie(user, res, jwt, jwtSecret);
                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                });
                return res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone_number: user.phone_number,
                        profile_picture: user.profile_picture,
                        business_name: user.business_name,
                        business_address: user.business_address,
                        business_logo: user.business_logo,
                    }
                });
            }
            return res.status(200).json({ message: 'OTP verification', tfa_enabled: true });
        });
    } catch (err) {
        console.error('Database Error:', err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const handleSendOtp = async (req, res, db, speakeasy, transporter, jwt, jwtSecret) => {
    const jwtToken = req.cookies.jwt;
    let email = '';
    if(jwtToken) {
        try {
            const decoded = jwt.verify(jwtToken, jwtSecret);
            email = decoded.email;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    } else {
        const { email: emailFromBody } = req.body;
        if (!emailFromBody) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        email = emailFromBody;
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });

    const { type } = req.body;

    try {

        const user = await db('users').where({ email }).first();
        if (user.verified && type === 'Register') {
            return res.status(409).json({ message: "User already exists." });
        }

        await db('otp_secrets')
            .insert({
                email,
                secret: secret.base32,
            })
            .onConflict('email')
            .merge();

        const html = getBody(user, otp);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'InvenTrack: Your OTP Code',
            html,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: 'OTP sent successfully',
            remaining_time: (30 - Math.floor((new Date()).getTime() / 1000.0 % 30)),
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.', error: error.message });
    }
};

const handleVerifyOtp = async (req, res, db, speakeasy, jwt, jwtSecret) => {
    const { otp } = req.body;
    const jwtToken = req.cookies.jwt;
    let email = '';

    if(jwtToken) {
        try {
            const decoded = jwt.verify(jwtToken, jwtSecret);
            email = decoded.email;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    } else {
        const { email: emailFromBody } = req.body;
        if (!emailFromBody) {
            return res.status(400).json({ message: 'Email is required.' });
        }
        email = emailFromBody;
    }
    try {
        const otp_secret = await db('otp_secrets').where({ email }).first();

        if (!otp_secret) {
            return res.status(404).json({ message: 'No OTP secret found for this email.' });
        }

        const isValid = speakeasy.totp.verify({
            secret: otp_secret.secret,
            encoding: "base32",
            token: otp,
            window: 2
        });

        if (isValid) {
            await db('users').where({ email }).update({ verified: true });
            await db('otp_secrets').where({ email }).del();
            return res.status(200).json({ message: 'OTP verified successfully.' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const handleUpdatePassword = async (req, res, db, bcrypt, saltRounds, jwt, jwtSecret) => {
    const { password, type } = req.body;
    const jwtToken = req.cookies.jwt;
    let { email } = req.body;

    if (!email) {
        try {
            const decoded = jwt.verify(jwtToken, jwtSecret);
            email = decoded.email;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
    }
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid submission: Email and Password are required.' });
    }

    try {
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let hash = '';
        if (type === 'forgot-password') {
            hash = await bcrypt.hash(password, saltRounds);
        } else {
            if (!password.current_password || !user.password_hash) {
                return res.status(400).json({ message: 'Current password is required for this operation.' });
            }

            const isMatch = await bcrypt.compare(password.current_password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
            }

            hash = await bcrypt.hash(password.new_password, saltRounds);
        }
        await db('users').where({ email }).update({ password_hash: hash });

        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Error updating password:', err.message);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const handleUpdateUser = async (req, res, db, jwt, jwtSecret) => {
    const user_id = req.user?.id;
    const { name, phone_number, business_name, business_address, tfa_enabled } = req.body;
    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized. User ID not found." });
    }

    if ((!name || !phone_number || !business_name || !business_address)) {
        return res.status(400).json({ message: "Name and phone number are required." });
    }

    try {
        await db("users").where({ id: user_id }).update({
            name,
            phone_number,
            business_name,
            business_address,
            tfa_enabled,
            updated_at: new Date(),
        });

        const updatedUser = await db("users")
            .select()
            .where({ id: user_id })
            .first();
        const token = createCookie(updatedUser, res, jwt, jwtSecret);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({ message: "Updated User Successfully", user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                profile_picture: updatedUser.profile_picture,
                business_name: updatedUser.business_name,
                business_address: updatedUser.business_address,
                business_logo: updatedUser.business_logo,
            }});
    } catch (err) {
        console.error("Error updating user:", err.message);
        return res.status(500).json({
            message: "Internal server error.",
            error: err.message,
        });
    }
};

const handleUpdateProfilePicture = async (req, res, db, jwt, jwtSecret) => {
    const user_id = req.user?.id;
    try {
        if (!user_id) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const user = await db('users').select('profile_picture').where({ id: user_id }).first();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.profile_picture) {
            const publicId = user.profile_picture.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`profile_images/${publicId}`);
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const result = await uploadToCloudinary('user_profile_images', req.file.buffer, {
            public_id: `${req.user.id}_${Date.now()}`,
            transformation: [{ width: 300, height: 300, crop: "fill" }]
        });

        if (!result || !result.secure_url) {
            return res.status(500).json({ error: "Image upload failed" });
        }

        const [updatedUser] = await db("users").where({ id: user_id }).update({ profile_picture: result.secure_url }).returning('*');

        const token = createCookie(updatedUser, res, jwt, jwtSecret);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({ message: "Updated User Successfully", user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                profile_picture: updatedUser.profile_picture,
                business_name: updatedUser.business_name,
                business_address: updatedUser.business_address,
                business_logo: updatedUser.business_logo,
            }});
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return res.status(500).json({ error: "Failed to update profile picture" });
    }
};

const handleUpdateBusinessLogo = async (req, res, db, jwt, jwtSecret) => {
    const user_id = req.user?.id;
    try {
        if (!user_id) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const user = await db('users').select('profile_picture').where({ id: user_id }).first();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.business_logo) {
            const publicId = user.business_logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`profile_images/${publicId}`);
        }


        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const result = await uploadToCloudinary('user_business_images', req.file.buffer, {
            public_id: `${req.user.id}_${Date.now()}`,
            transformation: [{ width: 300, height: 300, crop: "fill" }]
        });

        if (!result || !result.secure_url) {
            return res.status(500).json({ error: "Image upload failed" });
        }
        const [updatedUser] = await db("users").where({ id: user_id }).update({ business_logo: result.secure_url }).returning('*');

        const token = createCookie(updatedUser, res, jwt, jwtSecret);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({ message: "Updated User Successfully", user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                profile_picture: updatedUser.profile_picture,
                business_name: updatedUser.business_name,
                business_address: updatedUser.business_address,
                business_logo: updatedUser.business_logo,
            }});
    } catch (error) {
        console.error("Error updating profile picture:", error);
        return res.status(500).json({ error: "Failed to update profile picture" });
    }
};

export default {
    handleRegister,
    handleSignIn,
    handleSendOtp,
    handleVerifyOtp,
    handleUpdatePassword,
    handleUpdateUser,
    handleUpdateProfilePicture,
    handleUpdateBusinessLogo,
    handleGenerateToken,
};
