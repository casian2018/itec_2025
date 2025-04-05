
export default async function handler(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      res.status(200).json({ message: "Authenticated" });
    } catch (error) {
      res.status(401).json({ message: "Not authenticated" });
    }
  }
  