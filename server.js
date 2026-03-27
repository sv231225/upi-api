const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/check_upi", async (req, res) => {

    const { upi } = req.body;

    if(!upi){
        return res.json({ error:"UPI required" });
    }

    try{

        const response = await fetch(
            "https://aml-gui.chargebackzero.com/report_generation/upi_verify_proxy.php",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
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

    }catch(e){
        res.json({ status:"error" });
    }

});

app.get("/", (req,res)=>{
    res.send("UPI API is running 🚀");
});

app.listen(process.env.PORT || 3000);