const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Create your own blog today!";
const aboutContent = "I'm am a undergraduate student looking to further my career in Computer Science, and hope to gain as much knowledge and experience as possible. As I believe that's one of the most important tools for the 21st century. I am a hard-working, fast learning, and motivated student currently at pursuing a Bachelor of Science degree at York University located in Toronto, Ontario. I also love to help in my community by teaching little kids more about our culture and values. For he past several years I have volunteered at my local temple to education our younger brothers and sister the importance of maintaining our culture and values and embracing our differences while continuing to respect all those around you.";
const contactContent = "Call me at 647-771-0322 or email me at prabhsgill22@gmail.com";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
});

app.post("/", (req, res) => {
  res.redirect("/compose");
});

app.get("/about", (req, res) => {

  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res) => {

  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req, res) => {

  res.render("compose");
});

app.post("/compose", (req, res) =>{

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
})

app.get("/:postName", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find(function(err, posts){
    if(err){
        console.log(err);
    }
    else {
        posts.forEach(function(post){
          if(_.lowerCase(post.title) === requestedTitle){
            res.render("post", {
              title: post.title,
              content: post.content
            })
          }
        });
    }
});
})

app.listen(4000, function() {
  console.log("Server started on port 3000");
});
