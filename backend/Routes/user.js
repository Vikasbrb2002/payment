// backend/routes/user.js
const express = require('express');

const UserRouter = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
  username: zod.string().email(),
	firstname: zod.string(),
	lastname: zod.string(),
	password: zod.string()
})

UserRouter.post("/signup", async (req, res) => {
    try {
      // Validate the request body
      const parsedData = signupBody.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parsedData.error.errors
        });
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already taken"
        });
      }
  
      // Create the new user
      const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });
  
      // Create an account for the user
      const userId = user._id;
      await Account.create({
        userId,
        balance: 1 + Math.random()*10000
      });
  
      // Generate a JWT token for the user
      const token = jwt.sign({ userId }, JWT_SECRET);
  
      // Send the success response
      res.json({
        message: "User created successfully",
        token: token
      });
    } catch (e) {
      // Log the specific error
      console.error("Error during signup:", e);  // Log the detailed error
      res.status(500).json({
        message: "Something went wrong",
        error: e.message  // Send back the error message for debugging
      });
    }
  });
  
  
  


const signinBody = zod.object({
  username: zod.string().email(),
	password: zod.string() 
})

UserRouter.post("/signin", async (req, res) => {
  const { success, error } = signinBody.safeParse(req.body);
  if (!success) {
      return res.status(400).json({
          message: "Invalid input: " + error.errors.map(e => e.message).join(", ")
      });
  }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
})

UserRouter.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

UserRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})


UserRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username firstname lastname');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});



module.exports = UserRouter;