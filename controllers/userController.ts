import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";

export const registerUser = (req:any, res:any) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json("Invalid email format");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{12,}$/;
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json("Password should be at least 12 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character");
    }

    const checkUserExists = "SELECT * FROM Users WHERE email = ?";
    try {
        db.query(checkUserExists, req.body.email, (error:any, data:any) => {
            if (error) throw error;
            if (data.length) return res.status(409).json("User already exists!");

            const password = req.body.password;

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            const createUser = "INSERT INTO Users(`username`, `email`, `password`) VALUES (?, ?, ?)";
            const values = [req.body.username, req.body.email, hash];

            db.query(createUser, values, (error:any, data:any) => {
                if (error) throw error;
                return res.status(200).json("User has been created.");
            });
        });
    } catch (error) {
        return res.json(error);
    }
};

export const updateUser = (req:any, res:any) => {
        const { id, username, email, password } = req.body;

        try {
            if (password) {
                bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                    if (hashErr) throw hashErr;
                    const updateUserQuery = 'UPDATE Users SET `username`= ?, `email`= ?, `password`= ?';

                    db.query(updateUserQuery, [username, email, hashedPassword], (err:any, data:any) => {
                        if (err) throw err;
                        return res.status(200).json("User information has been updated.");
                    });
                });
            } else {
                const updateUserQuery = 'UPDATE Users SET `username`= ?, `email`= ? WHERE `id`= ?';

                db.query(updateUserQuery, [username, email, id], (err:any, data:any) => {
                    if (err) throw err;
                    return res.status(200).json("User information has been updated.");
                });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
};

export const deleteUser = (req:any, res:any) => {

    const deleteUserQuery = 'DELETE FROM Users WHERE `id`= ?';
    const id = req.params.userId;
    console.log(id);

    try {
        db.query(deleteUserQuery, [id], (err:any, data:any) => {
            if (err) throw err;
            return res.status(200).json("User has been deleted.");
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// export const deleteUser = (req:any, res:any) => {
//     const token = req.cookies.access_token;

//     if (!token) return res.status(401).json("Not authenticated!");

//     jwt.verify(token, "SecKey", (err:any, userInfo:any) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const deleteUserQuery = 'DELETE FROM Users WHERE `id`= ?';

//         try {
//             db.query(deleteUserQuery, [userInfo.id], (err:any, data:any) => {
//                 if (err) throw err;
//                 return res.status(200).json("User has been deleted.");
//             });
//         } catch (error) {
//             return res.status(500).json(error);
//         }
//     });
// };

// export const updateUser = (req:any, res:any) => {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not authenticated!");

//     jwt.verify(token, "SecKey", (err:any, data:any) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const { id, username, email, password } = req.body;
//         if (id !== data) return res.status(403).json("Not authorized!");

//         try {
//             if (password) {
//                 bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//                     if (hashErr) throw hashErr;
//                     const updateUserQuery = 'UPDATE Users SET `username`= ?, `email`= ?, `password`= ? WHERE `id`= ?';

//                     db.query(updateUserQuery, [username, email, hashedPassword, data.id], (err:any, data:any) => {
//                         if (err) throw err;
//                         return res.status(200).json("User information has been updated.");
//                     });
//                 });
//             } else {
//                 const updateUserQuery = 'UPDATE Users SET `username`= ?, `email`= ? WHERE `id`= ?';

//                 db.query(updateUserQuery, [username, email, data.id], (err:any, data:any) => {
//                     if (err) throw err;
//                     return res.status(200).json("User information has been updated.");
//                 });
//             }
//         } catch (error) {
//             return res.status(500).json(error);
//         }
//     });
// };
