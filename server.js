const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// ✅ Strong CORS Fix (handles everything)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// ✅ Handle preflight requests manually
app.options("*", cors());

// ✅ JSON parser
app.use(express.json());

// ============================
// UPI CHECK API
// ============================

app.post("/check_upi", async (req, res) => {

    const { upi } = req.body;

    if (!upi) {
        return res.json({ error: "UPI required" });
    }

    try {

        const response = await fetch(
            "https://aml-gui.chargebackzero.com/report_generation/upi_verify_proxy.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    recipientVpa: upi
                })
            }
        );

        const data = await response.json();

        res.json({
            status: data.status
        });

    } catch (e) {
        res.json({ status: "error" });
    }

});

// ============================
// ROOT CHECK
// ============================

app.get("/", (req, res) => {
    res.send("UPI API V2 🚀");
});

// ============================
// START SERVER
// ============================

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});
