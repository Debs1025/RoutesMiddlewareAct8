const express = require('express'); //install express
const app = express(); // EXPRESS APP

app.use(express.static('designs'));

app.set('view engine', 'ejs') 

//middleware
app.use(express.urlencoded({ extended: true }));

//Home Page
app.get('/', (req,res) => {
    
    const blogs = [     
        {title: 'CSDC105 ', snippet: 'Trends in Application Development'},
        {title: 'RestAPI', snippet: 'Basic'},
        {title: 'Finals', snippet: 'Sana perfect'},
    ];

    res.render('index', {title: "Home", blogs})
})

//About Page
app.get('/about', (req,res) => {
    res.render('about', {title: "About"})
})

//Redirect of about page
app.get('/about-us', (req,res) => {
    res.redirect('/about')
})

//Routing for create
app.get('/blogs/create', (req,res) => {
    res.render('create', {title: "Create"})
})
//create blog 
app.post('/blogs', (req, res) => {
    console.log(req.body); 
    res.redirect('/');
})

//Page not FOUND
app.use((req,res) => {
    res.status(404).render('404', {title: "404"})
})

//Server
app.listen(3000, () => {
   console.log('Server is running on port 3000');
});