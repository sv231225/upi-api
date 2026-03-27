const express = require("express");
const fetch = require("node-fetch");

const app = express();

// ============================
// 🔥 STRONG CORS FIX
// ============================
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

// ============================
// ✅ TEST ROUTE (VERY IMPORTANT)
// ============================
app.get("/test", (req, res) => {
    res.send("TEST OK ✅");
});

// ============================
// ✅ UPI CHECK ROUTE
// ============================
app.post("/check_upi", async (req, res) => {

    const { upi } = req.body;

    if (!upi) {
        return res.status(400).json({ error: "UPI required" });
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
            status: data.status || "unknown"
        });

    } catch (e) {
        res.status(500).json({ status: "error", message: e.toString() });
    }

});

// ============================
// ROOT
// ============================
app.get("/", (req, res) => {
    res.send("UPI API FINAL WORKING 🚀");
});

// ============================

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started 🚀");
});
