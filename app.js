import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/postDB");

  const postSchema = mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  });

  const Post = mongoose.model("posts", postSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const value = await Post.find();
  res.render("index.ejs",{post: value});
});

app.get("/post/:id", async (req, res) => {
  const indexValue = req.params.id;
  const value = await Post.findOne({_id: indexValue});
  res.render("post.ejs",{post: value});
});

app.get("/post/add/new", (req, res) => {
  try{
  res.render("newPost.ejs",{post:{}, edit:false});
  } catch(error){
    console.log("error", error)
  }
});

app.post("/newpost", async (req, res) => {
  try{
    const data = req.body;
    const newPost = new Post({
    title: data.title,
    date: new Date().toLocaleDateString(),
    desc: data.desc,
    content: data.content,
  });
  await newPost.save();
  res.redirect("/");
}catch(error){
  console.log("An error OCCURRED", error);
}
})

app.get("/post/edit/:id", async (req, res) => {
  const indexValue = req.params.id;
  console.log(indexValue)
  const value = await Post.findOne({_id: indexValue});
  res.render("newPost.ejs",{post: value, edit: true});
});


app.post("/post/changes/:id", async (req, res) => {
  const value = req.params.id;
  const data = req.body;
  const updatePost = await Post.updateOne({_id: value},{
    title: data.title,
    date: new Date().toLocaleDateString(),
    desc: data.desc,
    content: data.content,
  });
  res.redirect("/");
})


app.get("/post/delete/:id", async (req,res) => {
  const indexValue = req.params.id;
  const value = await Post.deleteOne({_id: indexValue});
  console.log(value);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});









