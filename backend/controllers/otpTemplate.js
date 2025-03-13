export const getBody = (user, otp) => {
    return(`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                            margin: auto;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .content {
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #007bff;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>OTP Verification</h2>
                        </div>
                        <div class="content">
                            <p>Dear ${user.name},</p>
                            <p>Your OTP code is:</p>
                            <div class="otp-code">${otp}</div>
                            <p>Please enter this code to complete your verification process.</p>
                        </div>
                        <div class="footer">
                            <p>If you did not request this code, please ignore this email.</p>
                        </div>
                    </div>
                </body>
            </html>`
    );
};