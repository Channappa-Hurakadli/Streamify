import { generateUnifyToken } from "../lib/stream.js";

export async function getUnifyToken(req, res) {
  try {
    const token = generateUnifyToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getUnifyToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}