var express = require('express');
var path = require('path');
var mysql= require('mysql');

var con=mysql.createConnection({
    host: "localhost",
  user: "root",
  password: "",
  database: "prison_managment"

});

con.connect(function(err){
if(err) throw err;
console.log('database connected successfully');
});

var router = express.Router();

router.use(express.static(__dirname+"./public/"));

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('/');
  };
  
  var date = new Date();
  console.log(date.yyyymmdd());
router.get('/',function(req, res, next) {
 var getQuery="select * from `prison`";
 con.query(getQuery,function(err,result){

    if(err) throw err;

    // res.render('index', { title: 'Employee Records', records:result,success:'' });
    result=result.map(item=>{
        var date1 = new Date();
        var date2 = new Date(item.release_date.yyyymmdd());
        var Difference_In_Time =date2 - date1 ;
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        Difference_In_Days =parseInt(Difference_In_Days)
        if(Difference_In_Days ==0){
        var deleteQuery="delete from `prison` where `prison_id`=?";
    var query=mysql.format(deleteQuery,item.prison_id);
     con.query(query,function(err){

         if(err) throw err;
 
    });
    var getQuery="select * from `visitor` where `prison_id`=? ";
    var query=mysql.format(getQuery,item.prison_id);
     con.query(query,function(err,result){
         if(err) throw err;
         var visitor_id =result[0].visitor_id
         var visitor_name=result[0].visitor_name
         var meeting_date =result[0].meeting_date
         var insertQuery='insert into `archive` (`visitor_id`,`prison_id`,`visitor_name`,`meeting_date`) VALUES (?,?,?,?)';

          var query=mysql.format(insertQuery,[visitor_id,item.prison_id,visitor_name,meeting_date]);
          con.query(query,function(err){

            if(err) throw err;
    
       });
        });
      
      
    var deleteQuery="delete from `visitor` where `prison_id`=?";
    var query=mysql.format(deleteQuery,item.prison_id);
     con.query(query,function(err){

         if(err) throw err;
 
    });
    return{
      prison_id:item.prison_id,
      prison_name:item.prison_name,
      release_date :item.release_date.yyyymmdd(),
      remaining_day : Difference_In_Days
      }
  }else{
    return{
      prison_id:item.prison_id,
      prison_name:item.prison_name,
      release_date :item.release_date.yyyymmdd(),
      remaining_day : Difference_In_Days
      }

  }    
    })
    result.filter(item=>{
      item.remaining_day>0
    })
    res.render('index',{title: 'Prison Management',records:result,success:''})
    console.log(result);
 
 });


});



router.post('/addprison', function(req, res, next) {
 
    var prison_name= req.body.prison_name;
    
    var release_date= req.body.release_date;
    console.log(req.body);
    
 
   var insertQuery='insert into `prison` (`prison_name`,`release_date`) VALUES (?,?)';

  var query=mysql.format(insertQuery,[prison_name,release_date]);
  con.query(query,function(err,response){
      if(err) throw err;
     // console.log(response.insertId);
     var getQuery="select * from `prison`";
 con.query(getQuery,function(err,result){

    if(err) throw err;
    // res.render('index', { title: 'Prison Records', records:result,success:'Record Inserted Successfully' });
    result=result.map(item=>{
        var date1 = new Date();
        var date2 = new Date(item.release_date.yyyymmdd());
        var Difference_In_Time =date2 - date1 ;
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        Difference_In_Days =parseInt(Difference_In_Days)
        return{
        prison_id:item.prison_id,
        prison_name:item.prison_name,
        release_date :item.release_date.yyyymmdd(),
        remaining_day : Difference_In_Days
        }
    })
    res.render('index',{title: 'Prison Management',records:result,success:''})
 
  });
});
});

router.get('/generate-ticket/:id', function(req, res, next) {
var id=req.params.id;

var getQuery="select * from `prison` where `prison_id`=?";
var query=mysql.format(getQuery,id);
 con.query(query,function(err,result){
     if(err) throw err;
     result=result.map(item=>{
      var date1 = new Date();
      var date2 = new Date(item.release_date.yyyymmdd());
      var Difference_In_Time =date2 - date1 ;
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      Difference_In_Days =parseInt(Difference_In_Days)
      return{
      prison_id:item.prison_id,
      prison_name:item.prison_name,
      release_date :item.release_date.yyyymmdd(),
      remaining_day : Difference_In_Days
      }
  })
       
res.render('generate-ticket', { title: 'Prison Records', records:result,success:'' });
 
});
});
router.post('/addvisitor', function(req, res, next) {
  var prison_id = req.body.prison_id;
  var visitor_name= req.body.visitor_name;
  var meeting_date= req.body.meeting_date;
  console.log(req.body);
  

 var insertQuery='insert into `visitor` (`prison_id`,`visitor_name`,`meeting_date`) VALUES (?,?,?)';

var query=mysql.format(insertQuery,[prison_id,visitor_name,meeting_date]);
con.query(query,function(err,response){
    if(err) throw err;
   // console.log(response.insertId);
   var getQuery="select * from `prison` where `prison_id`=?";
   var query=mysql.format(getQuery,prison_id);
    con.query(query,function(err,result){
        if(err) throw err;
        result=result.map(item=>{
         var date1 = new Date();
         var date2 = new Date(item.release_date.yyyymmdd());
         var Difference_In_Time =date2 - date1 ;
         var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
         Difference_In_Days =parseInt(Difference_In_Days)
         return{
         prison_id:item.prison_id,
         prison_name:item.prison_name,
         release_date :item.release_date.yyyymmdd(),
         remaining_day : Difference_In_Days
         }
     })
  res.render('generate-ticket',{title: 'Prison Management',records:result,success:'ticket generate successfully'})

});
});
});
router.get('/no-of-visitor/:id', function(req, res, next) {
  var id=req.params.id;
  
  var getQuery="select * from `prison` where `prison_id`=?";
  var query=mysql.format(getQuery,id);
   con.query(query,function(err,result){
       if(err) throw err;
       result=result.map(item=>{
        var date1 = new Date();
        var date2 = new Date(item.release_date.yyyymmdd());
        var Difference_In_Time =date2 - date1 ;
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        Difference_In_Days =parseInt(Difference_In_Days)
        return{
        prison_id:item.prison_id,
        prison_name:item.prison_name,
        release_date :item.release_date.yyyymmdd(),
        remaining_day : Difference_In_Days
        }
    })
         
  res.render('no-of-visitor', { title: 'Prison Records', records:result,success:'' });
   
  });
  });
  router.post('/no-of-visitor', function(req, res, next) {
    var prison_id = req.body.prison_id;
    
    var meeting_date= req.body.meeting_date;
    console.log(req.body);
    var getQuery="select * from `visitor` where `prison_id`=? and `meeting_date`=?";
  var query=mysql.format(getQuery,[prison_id,meeting_date]);
   con.query(query,function(err,result){
       if(err) throw err;
    //    result=result.map(item=>{
    //     var date1 = new Date();
    //     var date2 = new Date(item.release_date.yyyymmdd());
    //     var Difference_In_Time =date2 - date1 ;
    //     var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //     Difference_In_Days =parseInt(Difference_In_Days)
    //     return{
    //     prison_id:item.prison_id,
    //     prison_name:item.prison_name,
    //     release_date :item.release_date.yyyymmdd(),
    //     remaining_day : Difference_In_Days
    //     }
    // })
    console.log(result.length)
    
    res.render('no-of-visitor', { title: 'Prison Records', records:result.length,success:'successfully fetched data' });
  //  var insertQuery='insert into `visitor` (`prison_id`,`visitor_name`,`meeting_date`) VALUES (?,?,?)';
  
  // var query=mysql.format(insertQuery,[prison_id,visitor_name,meeting_date]);
  // con.query(query,function(err,response){
  //     if(err) throw err;
  //    console.log(response.insertId);
  //    var getQuery="select * from `prison` where `prison_id`=?";
  //    var query=mysql.format(getQuery,prison_id);
  //     con.query(query,function(err,result){
  //         if(err) throw err;
  //         result=result.map(item=>{
  //          var date1 = new Date();
  //          var date2 = new Date(item.release_date.yyyymmdd());
  //          var Difference_In_Time =date2 - date1 ;
  //          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  //          Difference_In_Days =parseInt(Difference_In_Days)
  //          return{
  //          prison_id:item.prison_id,
  //          prison_name:item.prison_name,
  //          release_date :item.release_date.yyyymmdd(),
  //          remaining_day : Difference_In_Days
  //          }
  //      })
  //   res.render('generate-ticket',{title: 'Prison Management',records:result,success:'ticket generate successfully'})
  
  // });
  });
  });
  router.get('/addstaff', function(req, res, next) {
    var id=req.params.id;
    
    var getQuery="select * from `staff` ";
    var query=mysql.format(getQuery,id);
     con.query(query,function(err,result){
         if(err) throw err;
         result=result.map(item=>{
        
          return{
          staff_id:item.staff_id,
          staff_name:item.staff_name,
         
          }
      })
           
    res.render('staff', { title: 'Staff Records', records:result,success:'' });
     
    });
    });

  router.post('/addstaff', function(req, res, next) {
 
    var staff_name= req.body.staff_name;
    
   
    console.log(req.body);
    
 
   var insertQuery='insert into `staff` (`staff_name`) VALUES (?)';

  var query=mysql.format(insertQuery,staff_name);
  con.query(query,function(err,response){
      if(err) throw err;
     // console.log(response.insertId);
     var getQuery="select * from `staff`";
 con.query(getQuery,function(err,result){

    if(err) throw err;
    // res.render('index', { title: 'Prison Records', records:result,success:'Record Inserted Successfully' });
    result=result.map(item=>{
       
        return{
        staff_id:item.staff_id,
        staff_name:item.staff_name,
       
        }
    })
    res.render('staff',{title: 'staff record',records:result,success:''})
 
  });
});
});
router.get('/addadmin', function(req, res, next) {
  var id=req.params.id;
  
  var getQuery="select * from `admin` ";
  var query=mysql.format(getQuery,id);
   con.query(query,function(err,result){
       if(err) throw err;
       result=result.map(item=>{
      
        return{
        admin_id:item.admin_id,
        admin_name:item.admin_name,
        admin_password:item.password
       
        }
    })
         
  res.render('admin', { title: 'admin Records', records:result,success:'' });
   
  });
  });

router.post('/addadmin', function(req, res, next) {

  var admin_name= req.body.admin_name;
  var password= req.body.admin_password;
  
 
  console.log(req.body);
  

 var insertQuery='insert into `admin` (`admin_name`,`password`) VALUES (?,?)';

var query=mysql.format(insertQuery,[admin_name,password]);
con.query(query,function(err,response){
    if(err) throw err;
   // console.log(response.insertId);
   var getQuery="select * from `admin`";
con.query(getQuery,function(err,result){

  if(err) throw err;
  // res.render('index', { title: 'Prison Records', records:result,success:'Record Inserted Successfully' });
  result=result.map(item=>{
     
      return{
      admin_id:item.admin_id,
      admin_name:item.admin_name,
      admin_password:item.password
     
      }
  })
  res.render('admin',{title: 'admin record',records:result,success:''})

});
});
});
// router.post('/update/', function(req, res, next) {
//     var id= req.body.id;
//     var name= req.body.uname;
//     var email= req.body.email;
//     var etype= req.body.emptype;
//     var hourlyrate= req.body.hrlyrate;
//    var totalHour= req.body.ttlhr;
//    var total= parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr);
 
//    var updateQuery='UPDATE `users` SET `name`=? ,`email`=?,`etype`=?,`hourlyrate`=?,`totalhour`=?,`total`=? where `id`=?';
//     var query=mysql.format(updateQuery,[name,email,etype,hourlyrate,totalHour,total,id]);
//   con.query(query,function(err,response){
//       if(err) throw err;
//      // console.log(response.insertId);
//   res.redirect('/');
// });
// });

// router.get('/delete/:id', function(req, res, next) {
//     var id=req.params.id;

//     var deleteQuery="delete from `users` where `id`=?";
//     var query=mysql.format(deleteQuery,id);
//      con.query(query,function(err){

//          if(err) throw err;
//  res.redirect('/');
//     });
    
// });

module.exports = router;
