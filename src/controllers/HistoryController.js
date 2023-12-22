const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const History = require("../models/History");
const { v4: uuidv4 } = require("uuid");

const storage = new Storage({ keyFilename: "bucket-key.json" });
const bucket = storage.bucket("model-fruition");

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const HistoryController = {
  createHistory: async (req, res) => {
    try {
      upload.single("file")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res
            .status(500)
            .send({ message: "Multer error: " + err.message });
        } else if (err) {
          return res
            .status(500)
            .send({
              message: "Terjadi kesalahan dalam upload file: " + err.message,
            });
        }

        if (!req.file) {
          return res.status(400).send({ message: "Please upload a file!" });
        }

        const uniqueFilename = `${uuidv4()}_${req.file.originalname}`; // Generate unique filename
        const blob = bucket.file(uniqueFilename);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on("error", (err) => {
          res.status(500).send({ message: err.message });
        });

        blobStream.on("finish", async () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`
          );

          const { predictedClass, accuracy } = req.body;
          if (!predictedClass || !accuracy) {
            return res
              .status(400)
              .send({ message: "Please provide all necessary data." });
          }

          const imagePath = publicUrl;

          try {
            const userId = req.user.id;
            await History.createHistory({
              userId,
              fruit: predictedClass,
              imagePath,
              accuracy,
            });

            res.status(201).send({
              message: "History berhasil dibuat dan file berhasil diupload.",
              url: publicUrl,
            });
          } catch (error) {
            res.status(500).send({
              message: `Terjadi kesalahan dalam membuat history: ${error}`,
            });
          }
        });

        blobStream.end(req.file.buffer);
      });
    } catch (error) {
      res.status(500).send({
        message: `Terjadi kesalahan dalam upload file: ${req.file.originalname}. ${error}`,
      });
    }
  },

  getAllHistories: async (req, res) => {
    try {
      const userId = req.user.id;
      const histories = await History.getAllHistoriesByUserId(userId);
      res.json(histories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch histories" });
    }
  },

  deleteHistory: async (req, res) => {
    try {
      const { historyId } = req.params; // Ambil historyId dari URL
      const userId = req.user.id;

      // Cari riwayat yang akan dihapus
      const history = await History.getHistoryById(historyId);

      // Pastikan riwayat ditemukan dan milik user yang sesuai
      if (!history || history.userId !== userId) {
        return res
          .status(404)
          .send({ message: "History not found or unauthorized." });
      }

      // Hapus riwayat
      await History.deleteHistoryById(historyId);

      res.status(200).send({ message: "History deleted successfully." });
    } catch (error) {
      res.status(500).send({ message: `Failed to delete history: ${error}` });
    }
  },
};

module.exports = HistoryController;
