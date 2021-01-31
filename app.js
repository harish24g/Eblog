var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var firebase = require("firebase/app");
var http = require('http')
var server = http.createServer(function(req,res){
    console.log('url'+req.url)
})


//Firebase services
require("firebase/auth");
require("firebase/firestore");
require('firebase/analytics');
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBqyZtabwYKZemHCSPXP9cO6WdA7wmVFOo",
    authDomain: "elitedoctorsconsultancy-3291a.firebaseapp.com",
    databaseURL: "https://elitedoctorsconsultancy-3291a.firebaseio.com",
    projectId: "elitedoctorsconsultancy-3291a",
    storageBucket: "elitedoctorsconsultancy-3291a.appspot.com",
    messagingSenderId: "1021452637022",
    appId: "1:1021452637022:web:a284a33ec6f77e7e7c75cf",
    measurementId: "G-YDFPLDSEFP"
  };
firebase.initializeApp(firebaseConfig);
const auth =firebase.auth();
const db=firebase.firestore();



app.set('view engine', 'ejs')
app.use(express.static('views'))
app.set('views',__dirname + '/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// auth.onAuthStateChanged(user =>{
    
//     console.log(user.email);
//      b=user.email
// });  
    

    


app.get('/',function(req,res){
   
//     db.collection('blogs').onSnapshot(snapshot =>
//         {
//             //setupGuides(snapshot.docs);
            
//             res.render('home.ejs',{data:snapshot});
       
// });
auth.onAuthStateChanged(user =>{
    if(user)
    {
    b=user.email;
    str="MY POSTS";
}
    else
    {
         b="LOGIN TO CONTINUE";
         str = "GET YOUR POSTS";
         
   }
db.collection('blogs').get()
  .then((snapshot) => {
    var blogs=[];
    var ids = [];
    snapshot.docs.forEach(doc =>{
        var postid = doc.id;
        ids.push(postid)
        blogs.push(doc.data());
     
       // db.collection('blogs').snapshotChanges().map(actions => {
         //   return actions.map(a => {
             // const data = a.payload.doc.data();
           //   const id = a.payload.doc.id;
           // });
         // });
     //res.render('home.ejs',{ data : blogs });
    });
    

    res.render('home.ejs',{ data : blogs,cool :b , pid : ids , mypost : str});
    //res.render("myposts.ejs",{data:blogs});
  })
  .catch((err) => {

    console.log('Error getting documents', err);
  });
});
});


// auth.onAuthStateChanged(user =>{
//     if(user)
//     {
//     b=user.email;
//     c=JSON.stringify(b);
//     console.log(c);
    
// }
//     else
//     {
//         console.log("please log in to post");
         
//    }}
app.get('/myposts',function(req,res){

var user = firebase.auth().currentUser;
if(user)
{
    b=user.email;
}
else{
    b="";
}
db.collection('blogs').where('mail','==',b).get()
  .then((snapshot) => {
    var blogs=[];
    var ids=[];
    
    snapshot.docs.forEach(doc =>{
       
        blogs.push(doc.data());
        ids.push(doc.id);
     
    });
    console.log(blogs);
    res.render("myposts.ejs",{data:blogs,pid:ids});
})
.catch(function(err){
    console.log('cant fetch',err);

});
});
    

   
    


// app.post('/',function(req,res){
//     var name = req.body.uname;
//     res.render("output.ejs" , {data: name})
// })

app.get('/login', function(req, res){
    res.render('loginform.ejs');
})

app.get('/new' , function(req,res){
    res.render('newpost.ejs')
})

app.post('/',function(req,res){
    const email=req.body.email;
    const password=req.body.pwd;

    //sign up
    auth.createUserWithEmailAndPassword(email,password).then(e =>{
           res.redirect('/');
        })
    });
    

 app.post('/home',function(req,res){
        const email=req.body.uname;
        const password=req.body.password;
    
        //log in
        auth.signInWithEmailAndPassword(email,password).then(e =>{
           
    
        
                res.redirect('/');
               
          
           
              
            })
           
            
    
        });
        auth.onAuthStateChanged(user =>{
            if(user)
            {
            b=user.email;
            
        }
            else
            {
                console.log("please log in to post");
                 
           }

    app.post('/result',function(req,res){
        const title=req.body.title;
        const content=req.body.comment;
        const imgurl=req.body.pic;
        const mail = b;
        db.collection('blogs').add({
            title:title,
            content:content,
            imgurl:imgurl,
            mail:mail
            
        }).then(()=>{ 
            res.redirect('/');
        });

    });
});

    
    app.get('/faq',function(req,res){
        res.render("faq.ejs");
    })

app.get('/back',function(req,res){
    res.render("home.ejs");
})

app.post('/fullpost' , function(req,res)
{
    var ppid =req.body.shit;
   console.log(ppid);
})


app.get('/myposts' , function(req,res){

    res.render("myposts.ejs")
})

app.post('/deletepost',function(req,res){
    // db.collection('blogs').onSnapshot((snapshot)=>{
    //     snapshot.docs.forEach(doc=>{
    //         //if(req.body.k==doc.id)
    //         db.collection('blogs').doc(doc.id).delete();
    //     });    
    // });
    console.log(req.body.k);
    db.collection('blogs').doc(req.body.k).delete();  
    res.redirect('/myposts');
});

app.get("/backhome",function(req,res){
    res.redirect('/');
})

app.post('/editpost',function(req,res){
    k=req.body.k;
    
    db.collection('blogs').where(firebase.firestore.FieldPath.documentId(), '==',k).get().then((snapshot) => {
       var barr = []
        snapshot.docs.forEach(doc=>{
            title=doc.data().title;
            imgurl=doc.data().imgurl;
            content=doc.data().content;
            barr.push(title)
            barr.push(imgurl)
            barr.push(content)
            barr.push(k)
            console.log(barr[0])
           
       
    //    imgurl=snapshot.docs.imgurl || 0;
    //    content=snapshot.docs.content || 0;
    //     title=0;
        
         res.render("edit.ejs",{barr: barr});
    });
});
});
app.post("/edited",function(req,res){
  var name = req.body.title;
  var pics = req.body.pic;
  var cont = req.body.txtarea;
  var pid = req.body.iid;
  db.collection('blogs').doc(pid).update({
  
        title:name,
        imgurl:pics,
        content:cont,
  })
  res.redirect("/");
});

   
         





app.listen(5000 , function(){
    console.log('listening');
});

