const express=require("express");
const _ =require("lodash");
var app=express();
app.use(express.static("public"))
const bp=require("body-parser");
app.set('view engine','ejs');
app.use(bp.urlencoded({extended:true}));
const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
const url="mongodb+srv://admin-tejash:tjshrnjn21@cluster0.qpiruox.mongodb.net/todolistDB";
// const url="mongodb://127.0.0.1:27017/listing"
mongoose.connect(url,{useNewUrlParser: true});


const newSchema={
  name:String
};
const testModel=new mongoose.model('test',newSchema);

const listSchema={
  name:String,
  items:[newSchema]
};

const List=new mongoose.model("List",listSchema);
app.get("/",function(req,res){
  testModel.find({},function(err,foundItems){
    res.render("list",{puthere:"Today",newItems:foundItems});
  })
})

app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName},function (err,foundList) {
    if(!err){
      if(!foundList){
        const list=new List({
          name:customListName,
          items:[]
        });
        list.save();
        res.redirect("/"+customListName);
      }
      else{
        res.render("list",{puthere:foundList.name,newItems:foundList.items});
      }
    }
  })
})
app.post("/",function(req,res){
  var item=req.body.newitem;
  var listName=req.body.list;
  const item1=new testModel({
    name:item
  });
  if(listName==="Today"){
    if(item===""){ console.log(`no input to add`); }
    else{
      item1.save();
      res.redirect("/");
    }
  }
  else{
    if(item===""){ console.log(`no input to add`); }
    else{
      List.findOne({name:listName},function (err,foundList) {
        foundList.items.push(item1);
        foundList.save();
      });
      res.redirect("/"+listName);
    }
  }
});


app.post("/delete",function (req,res) {
  var itemid=req.body.checkbox;
  var listName=req.body.listName;
  if(listName==="Today"){
    testModel.findByIdAndRemove(itemid,function (err) {
      console.log(`Successfully deleted item`);
    })
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemid}}},function (err,foundList) {
      if(!err) res.redirect("/"+listName);
    })
  }
})
app.listen(3000,function(){
    console.log(`server is starting at port number 3000`);
})
