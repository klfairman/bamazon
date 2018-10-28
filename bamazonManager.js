var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "products_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start(){
    inquirer.prompt([{
        type: "list",
        name: "maintainInventory",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
      }]).then(function(ans){
         switch(ans.maintainInventory){
          case "View Products for Sale": viewProducts();
          break;
          case "View Low Inventory": viewLowInventory();
          break;
          case "Add to Inventory": addToInventory();
          break;
          case "Add New Product": addNewProduct();
          break;
          case "End Session": console.log("Session Ended");
        }
      });
    }
    

    
    function viewProducts(){
        console.log("All Items in stock ");
      
        connection.query('SELECT * FROM products', function(err, res){
        if(err) throw err;
        console.log('----------------------------------------------------------------------------------------------------')
      
        for(var i = 0; i<res.length;i++){
          console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "Quantity in Stock: " + res[i].stock_quantity);
          console.log('--------------------------------------------------------------------------------------------------')
        }
      
        });
      }

    function viewLowInventory(){
      console.log("Low Inventory");
    
      connection.query('SELECT * FROM products', function(err, res){
      if(err) throw err;
      for(var i = 0; i<res.length;i++){
        if(res[i].stock_quantity <= 5){
        console.log("Item ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "Quantity in Stock: " + res[i].stock_quantity);
        console.log('--------------------------------------------------------------------------------------------------');
        }
      }
      });
    }
    


    function addToInventory(){
      console.log("Add Items to Inventory");
    
      connection.query('SELECT * FROM products', function(err, res){
      if(err) throw err;
      var itemArray = [];
      for(var i=0; i<res.length; i++){
        itemArray.push(res[i].product_name);
      }
    
      inquirer.prompt([{
        type: "list",
        name: "product",
        choices: itemArray,
        message: "Which item would you like to add inventory?"
      }, {
        type: "input",
        name: "qty",
        message: "How many units would you like to add?",
        validate: function(value){
          if(isNaN(value) === false){return true;}
          else{return false;}
        }
        }]).then(function(ans){
          var currentQty;
          for(var i=0; i<res.length; i++){
            if(res[i].product_name === ans.product){
              currentQty = res[i].sto;
            }
          }
          connection.query('Update products SET stock_quantity = ? WHERE product_name = ?', [
            currentQty + parseInt(ans.qty),
            ans.product
            ], function(err, res){
              if(err) throw err;
              console.log("Stock quantity updated.");
              start();
            });
          })
      });
    }
    
   

    function addNewProduct(){
      console.log("Add a new item.");
      var deptNames = [];
    
      connection.query('SELECT * FROM products', function(err, res){
        if(err) throw err;
        for(var i = 0; i<res.length; i++){
          deptNames.push(res[i].department_name);
        }
      })
    
      inquirer.prompt([{
        type: "input",
        name: "product",
        message: "Product: ",
        validate: function(value){
          if(value){return true;}
          else{return false;}
        }
      }, {
        type: "list",
        name: "department",
        message: "Department: ",
        choices: deptNames
      }, {
        type: "input",
        name: "price",
        message: "Price: ",
        validate: function(value){
          if(isNaN(value) === false){return true;}
          else{return false;}
        }
      }, {
        type: "input",
        name: "quantity",
        message: "Quantity: ",
        validate: function(value){
          if(isNaN(value) == false){return true;}
          else{return false;}
        }
      }]).then(function(ans){
        connection.query('Update products SET ? WHERE ?',{
         product_name: ans.product,
         department_name: ans.department,
         price: ans.price,
         stock_quantity: ans.quantity
        }, function(err, res){
          if(err) throw err;
          console.log("Item added to Bamazon.");
        })
        start();
      });
    }
    
  