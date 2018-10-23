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

// function which prompts the user for what action they should take
function start(){
  //prints the items for sale and their details
  connection.query('SELECT * FROM products', function(err, res){
    if(err) throw err;
  
    console.log('Welcome to BAMAZON!')
    console.log('----------------------------------------------------------------------------------------------------')
  
    for(var i = 0; i<res.length;i++){
      console.log("Item ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "Quantity in Stock: " + res[i].stock_quantity);
      console.log('--------------------------------------------------------------------------------------------------')
    }
  
    inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "What is the ID of the product you would like to purchase?",
        validate: function(value){
          if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
            return true;
          } else{
            return false;
          }
        }
      },
      {
        type: "input",
        name: "qty",
        message: "How many units would you like to purchase?",
        validate: function(value){
          if(isNaN(value)){
            return false;
          } else{
            return true;
          }
        }
      }
      ]).then(function(ans){
        var productChoice = (ans.id)-1;
        var unitsWanted = parseInt(ans.qty);
        var grandTotal = parseFloat(((res[productChoice].price)*unitsWanted));
  
       
        if(res[productChoice].stock_quantity>= unitsWanted){
          //after purchase, updates quantity in Products
           //check if order can be fulfilled
          connection.query("UPDATE products SET ? WHERE ?", [
          {stock_quantity: (res[productChoice].stock_quantity - unitsWanted)},
          {item_id: ans.id}
          ], function(err, result){
              if(err) throw err;
              console.log("Your total is $" + grandTotal)
              console.log("Thank you for shopping!")
          })
  
        } else{
          console.log("Our apologies. We do not have enough units in stock and cannot complete your order.");
        }
  
        start();
      })
  })
  }
  
  