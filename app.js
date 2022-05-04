import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import _ from 'lodash';
import alert from 'alert';

const startingHomeContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt. Quis viverra nibh cras pulvinar mattis nunc sed. Quam lacus suspendisse faucibus interdum posuere. Non odio euismod lacinia at quis. Tortor at risus viverra adipiscing at in. Morbi tincidunt ornare massa eget. Porttitor lacus luctus accumsan tortor posuere ac ut. Nisi lacus sed viverra tellus in hac habitasse platea. Faucibus a pellentesque sit amet porttitor eget. Vulputate sapien nec sagittis aliquam. Enim facilisis gravida neque convallis a cras. Non pulvinar neque laoreet suspendisse interdum consectetur. Quam id leo in vitae. Enim nec dui nunc mattis enim ut tellus elementum.';

const aboutContent = 'Fermentum iaculis eu non diam phasellus vestibulum lorem. Sapien et ligula ullamcorper malesuada. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Quam adipiscing vitae proin sagittis. Ut faucibus pulvinar elementum integer enim neque volutpat. Ornare arcu odio ut sem nulla. Lorem mollis aliquam ut porttitor leo. Lectus magna fringilla urna porttitor. Convallis a cras semper auctor neque. Nisl vel pretium lectus quam. Leo vel fringilla est ullamcorper eget nulla. Risus commodo viverra maecenas accumsan lacus vel facilisis. Amet massa vitae tortor condimentum. Urna porttitor rhoncus dolor purus non enim praesent elementum. Erat imperdiet sed euismod nisi porta lorem mollis. Ligula ullamcorper malesuada proin libero nunc consequat. Id neque aliquam vestibulum morbi. Lacus luctus accumsan tortor posuere ac.';

const contactContent = 'Quam adipiscing vitae proin sagittis. Ut faucibus pulvinar elementum integer enim neque volutpat. Ornare arcu odio ut sem nulla. Lorem mollis aliquam ut porttitor leo. Lectus magna fringilla urna porttitor. Convallis a cras semper auctor neque. Nisl vel pretium lectus quam. Leo vel fringilla est ullamcorper eget nulla. Risus commodo viverra maecenas accumsan lacus vel facilisis. Amet massa vitae tortor condimentum. Urna porttitor rhoncus dolor purus non enim praesent elementum. Erat imperdiet sed euismod nisi porta lorem mollis. Ligula ullamcorper malesuada proin libero nunc consequat. Id neque aliquam vestibulum morbi. Lacus luctus accumsan tortor posuere ac.';

main().catch(err => console.log(err));

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function main() {
  mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true});
}

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('home', {
            startingContent: startingHomeContent,
            posts: posts
        });
    });
});

app.get('/about', (req, res) => {
    res.render('about', {aboutContent: aboutContent});
});

app.get('/contact', (req, res) => {
    res.render('contact', {contactContent: contactContent});
});

app.get('/compose', (req, res) => {
    res.render('compose')
});

app.post('/compose', (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });
    
    post.save((err) => {
        if (!err) {
            res.redirect('/');
        }
    });
});

app.get('/posts/:postId', (req, res) => {
    const requestedPostId = _.lowerCase(req.params.postId);

    Post.findOne({ _id: requestedPostId }, (err, post) => {
        res.render('post', {
            title: post.title,
            content: post.content
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const actualPassword = 'admin';
    const password = req.body.adminPassword;

    if (actualPassword === password) {
        res.redirect('/compose');
    } else {
        alert('Incorrect password, please try again!');
        res.redirect('/');
    }
        
    
});


app.listen(3000, () => {
    console.log('Server started on port 3000.');
});