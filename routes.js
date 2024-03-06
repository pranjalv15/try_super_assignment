const { Router, query } = require("express");
const db = require("./db");

const router = Router();

router.post("/", async (req, res) => {
  const { customer_id, invoice_items } = req.body;
  const result = await db.query("SELECT * from invoice");
  let invoice_id = 1;
  if (!!result.rows && result.rows.length > 0) {
    invoice_id = result.rows[result.rows.length - 1].id + 1;
  }

  //console.log(result.rows);
  try {
    invoice_items.forEach(async (item) => {
      await db.query(
        "INSERT INTO invoice_item (invoice_id,price,name,quantity) VALUES ($1,$2,$3,$4)",
        [invoice_id, item.price, item.name, item.quantity]
      );
    });

    //console.log(invoice_id);

    const invoice_total_rows = await db.query(
      "select sum(invoice_item.price*invoice_item.quantity) from invoice inner join invoice_item on invoice.id=invoice_item.invoice_id where invoice_item.invoice_id= $1",
      [invoice_id]
    );
    // console.log(invoice_total_rows);
    // console.log("this is invoice total");
    let invoice_total = invoice_total_rows.rows[0].sum;
    if (invoice_total === null) {
      invoice_total = 0;
    }
    console.log(invoice_total);
    await db.query(
      "INSERT INTO invoice (customer_id,invoice_total) VALUES ($1,$2)",
      [customer_id, invoice_total]
    );

    res.status(200).json("successfully created invoice");
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const { customer_id } = req.query;
    const result = await db.query(
      "SELECT sum(invoice_total) FROM invoice WHERE customer_id=$1",
      [customer_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
