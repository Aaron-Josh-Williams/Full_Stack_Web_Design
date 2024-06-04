//set up the server
const express = require("express");
const db = require("./db/db_connection");
const app = express();
const port = 3000;

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

likes = Math.round(Math.random()*99);

// COnfigures Express to parese URL encoded POST request bodies
app.use(express.urlencoded({extended: false}));

const get_all_index_items = `
    SELECT post_id, post_img, post_caption
    FROM post
`;

app.get("/", (req, res)=>{
    db.execute(get_all_index_items, (error, results) => {
        if (error) {
            res.status(500).send(error); // Internal Server Error
        } else {
            // res.send(results);
            res.render("insta_page", { post: results });
        }
    });
});

const create_post = `
    INSERT INTO post (post_img, post_caption)
    VALUES (?, ?)
`;

app.post("/", (req, res) => {
    db.execute(create_post, [req.body.post_img, req.body.post_caption], (error, results) => {
        if(error){
            res.status(500).send(error);
        }
        else {
            res.redirect("/");
        }
    });
});

const delete_post = `
    DELETE FROM post
    WHERE post_id = ?
`;

app.get('/:id/delete', (req, res) => {
    db.execute(delete_post, [req.params.id], (error, results) =>{
        if (error){
            res.status(500).send(error);
        }
        else{
            res.redirect('/');
        }
    });
});

// start the server
app.listen(port, () => {
    console.log(
        `App server listening on ${port}. (Go to http://localhost:${port})`
    );
});