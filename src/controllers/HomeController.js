const HomeController = {
  getHomePage: (req, res) => {
    const { username } = req.user; // Mengambil username dari data pengguna yang telah disimpan di middleware

    res.status(200).json({ message: `Welcome to the Home Page, ${username}` });
  },
};

module.exports = HomeController;
