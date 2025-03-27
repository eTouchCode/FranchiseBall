import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { validateLoginInput, validateRegisterInput } from "../validators/authValidator";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.is('application/json')) {
      res.status(400).json({ message: "Content-Type must be application/json" });
      return;
    }

    const { error } = validateRegisterInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { username, team_name, password } = req.body;
    console.log(req.body)
    if (!username || !team_name || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await registerUser(username, team_name, password);

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        username: user.username,
        team_name: user.team_name,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.is('application/json')) {
      res.status(400).json({ message: "Content-Type must be application/json" });
      return;
    }

    const { error } = validateLoginInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { team_name, password } = req.body;

    if (!team_name || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const { token, user } = await loginUser(team_name, password);

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: user
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
}



// import { Request, Response } from "express";
// import { loginUser, registerUser } from "../services/authService";
// import { validateLoginInput, validateRegisterInput } from "../validators/authValidator";

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { error } = validateRegisterInput(req.body);
//     if (error) {
//       res.status(400).json({ message: error.details[0].message });
//       return;
//     }

//     const { username, team_name, password } = req.body;

//     const user = await registerUser(username, team_name, password);

//     res.status(201).json({
//       message: "User registered successfully!",
//       user: {
//         username: user.username,
//         team_name: user.team_name,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(400).json({ message: err.message });
//     } else {
//       console.error(err);
//       res.status(500).json({ message: "Server error. Please try again." });
//     }
//   }
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { error } = validateLoginInput(req.body);
//     if (error) {
//       res.status(400).json({ message: error.details[0].message });
//       return;
//     }

//     const { team_name, password } = req.body;
//     const { token, user } = await loginUser(team_name, password);

//     res.status(200).json({
//       message: 'Login successful!',
//       token: token,
//       user: user
//     });
//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(400).json({ message: err.message });
//     } else {
//       console.error(err);
//       res.status(500).json({ message: "Server error. Please try again." });
//     }
//   }
// }