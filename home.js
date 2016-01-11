//Scripts 'n shit
document.addEventListener('DOMContentLoaded', function() {
    var userID = 0;
    //var currentCourse = 0;
    var courses;
    var books;
    var cart = [];
    var cart_quantities = [];
    updateView();
    updateHomeTable();
    document.getElementById('course_view').style.display = 'none';
    document.getElementById('register_view').style.display = 'none';
    document.getElementById('cart_view').style.display = 'none';
    document.getElementById('account_view').style.display = 'none';
    
    document.getElementById('logout_btn').addEventListener('click', function() {
        userID = 0;
        cart = [];
        cart_quantities = [];
        courses = [];
        books = [];
        updateView();
    });
    
    document.getElementById('register_btn').addEventListener('click', function() {
        var tempuser = document.getElementById('userfield').value;
        var temppass = document.getElementById('passfield').value;
        document.getElementById('userfield').value = "";
        document.getElementById('passfield').value = "";
        
        document.getElementById('home_view').style.display = 'none';
        document.getElementById('register_view').style.display = "block";
        document.getElementById('reg_userfield').value = tempuser;
        document.getElementById('reg_passfield').value = temppass;
    });
    
    document.getElementById('reg_btn').addEventListener('click', function() {
        var username = document.getElementById('reg_userfield').value;
        var password = document.getElementById('reg_passfield').value;
        var email = document.getElementById('reg_emailfield').value;
        var name = document.getElementById('reg_namefield').value;
        $.ajax({
            url: '/~jackgoodman/bookdrop/register.php',
            type: 'POST',
            dataType: 'JSON',
            data: "username=" + username + "&password=" + password
                + "&email=" + email + "&name=" + name,
            success: function(data) {
                if (data.success) {
                    alert("Register success!");
                    document.getElementById('reg_userfield').value = "";
                    document.getElementById('reg_passfield').value = "";
                    document.getElementById('reg_emailfield').value = "";
                    document.getElementById('reg_namefield').value = "";
                    
                    document.getElementById('register_view').style.display = 'none';
                    document.getElementById('home_view').style.display = 'block';
                } else {
                    alert("Register failed");
                }
            },
            error: function(xhr, status, error) {
                alert("Register broke" + xhr.responseText);
            }
        });
    });
    
    document.getElementById('login_btn').addEventListener('click', function() {
        var username = document.getElementById('userfield').value;
        var password = document.getElementById('passfield').value;
        $.ajax({
            url: '/~jackgoodman/bookdrop/login.php',
            type: 'POST',
            dataType: 'JSON',
            data: "username=" + username + "&password=" + password,
            success: function(data) {
                if (data.success) {
                    userID = data.userID;
                    document.getElementById('userfield').value = "";
                    document.getElementById('passfield').value = "";
                    
                    document.getElementById('register_view').style.display = 'none';
                    document.getElementById('home_view').style.display = 'block';
                    updateView();
                } else {
                    alert("Login failed: " + data.pwd_atmpt + " " + data.pwd_hash);
                }
            },
            error: function(xhr, status, error) {
                alert("Login broke" + xhr.responseText);
            }
        });
    });
    
    document.getElementById('home_btn').addEventListener('click', function() {
        document.getElementById('query').value = '';
        document.getElementById("home_view").style.display = 'block';
        document.getElementById('course_view').style.display = 'none';
        document.getElementById('cart_view').style.display = 'none';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('account_view').style.display = 'none';
        updateHomeTable();
    });
    
    document.getElementById('query_btn').addEventListener('click', function() {
        updateHomeTable();
    });
    
    function updateHomeTable() {
        var query = document.getElementById('query').value;
        document.getElementById('home_table').innerHTML = "<tr><th>Books:</th><th>Course:</th><th>Course Title:</th><th>Professor:</th>"
        $.ajax({
            url: '/~jackgoodman/bookdrop/update-home.php', //CREATE ME
            type: 'POST',
            dataType: 'JSON',
            data: "query=" + query,
            success: function(data) {
                var table = document.getElementById('home_table');
                courses = data;
                for (var i = 0; i < courses.length; i++) {
                    var row = table.insertRow(i+1);
                    var booksCell = row.insertCell(0);
                    var courseCell = row.insertCell(1);
                    var titleCell = row.insertCell(2);
                    var professorCell = row.insertCell(3);
                    
                    booksCell.innerHTML = '<button id="home-' + courses[i].courseID + '">Books</button>';
                    courseCell.innerHTML = courses[i].code;
                    titleCell.innerHTML = courses[i].title;
                    professorCell.innerHTML = courses[i].professor;       
                }
                addHomeButtonListeners();
            },
            error: function(xhr, status, error) {
                alert("update home broke" + xhr.responseText);
            }
        });
    }
    
    function addHomeButtonListeners() {
        console.log(courses);
        for (var i = 0; i < courses.length; i++) {
            var current_btn = document.getElementById("home-" + courses[i].courseID);
            var currentCourse = courses[i].courseID;
            (function(btn, course) {
                console.log(btn);
                btn.addEventListener('click', function() {
                    showCoursePage(course);
                });
            })(current_btn, currentCourse);
            
        }
    }
    
    function showCoursePage(course) {
        
        var table = document.getElementById('course_table');
        for (var i = 1; i < table.rows.length; i++) {
            table.deleteRow(i);
        }
        
        document.getElementById('home_view').style.display = 'none';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('cart_view').style.display = 'none';
        document.getElementById('account_view').style.display = 'none';
        document.getElementById('course_view').style.display = 'block';
        
        $.ajax({
            url: '/~jackgoodman/bookdrop/update-course.php',
            type: 'POST',
            dataType: 'JSON',
            data: "currentCourse=" + course,
            success: function(data) {
                books = data;
                console.log(books.length);
                for (var j = 0; j < books.length; j++) {
                    var row = table.insertRow(j+1);
                    var addCell = row.insertCell(0);
                    var bookCell = row.insertCell(1);
                    var authorCell = row.insertCell(2);
                    var priceCell = row.insertCell(3);
                    var noteCell = row.insertCell(4);
                    
                    addCell.innerHTML = '<button id="book-' + books[j].bookID + '">Add to Cart</button>';
                    bookCell.innerHTML = books[j].name;
                    authorCell.innerHTML = books[j].author;
                    priceCell.innerHTML = '$' + books[j].price + ".00";
                    noteCell.innerHTML = books[j].notes;
                }
                addBooksButtonListeners();
            },
            error: function(xhr, status, error) {
                alert("update course broke" + xhr.responseText);
            }
        });
    }
    
    function addBooksButtonListeners() {
        for (var i = 0; i < books.length; i++) {
            var add_btn = document.getElementById("book-" + books[i].bookID);
            var to_add = books[i].bookID;
            (function(btn, add) {
                btn.addEventListener('click', function() {
                    var inArray = $.inArray(add, cart);
                    if (inArray == -1) {
                        cart.push(add);
                        cart_quantities.push(1);
                    } else {
                        cart_quantities[inArray]++;
                    }
                    var cart_count = 0;
                    for (var c = 0; c < cart.length; c++) {
                        cart_count += cart_quantities[c];
                    }
                    document.getElementById('cart').innerHTML = "View Cart (" + cart_count + ")";
                });
            })(add_btn, to_add);
        }
    }
    
    document.getElementById('add_all_to_cart_btn').addEventListener('click', function() {
        console.log(books);
        for (var i = 0; i < books.length; i++) {
            var inArray = $.inArray(books[i].bookID, cart);
            if (inArray == -1) {
                cart.push(books[i].bookID);
                cart_quantities.push(1);
            } else {
                cart_quantities[inArray]++;
            }
        }
        document.getElementById('cart').innerHTML = "View Cart (" + cart.length + ")";
    });
    
    document.getElementById('cart').addEventListener('click', function() {
        showCartView();
        addUpdateListener();
    });
                                                     
    function showCartView() {
        //alert(cart);
        var table = document.getElementById('cart_table');
        for (var i = 1; i < table.rows.length; i++) {
            table.deleteRow(i);
        }
        
        document.getElementById('course_view').style.display = 'none';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('home_view').style.display = 'none';
        document.getElementById('cart_view').style.display = 'block';
        
        var row_count = 0;
        var index = -1;
        var promises = [];
        for (var i = 0; i < cart.length; i++) {
            
            var request = $.ajax({
                url: '/~jackgoodman/bookdrop/update-cart.php',
                type: 'POST',
                dataType: 'JSON',
                data: "courseID=" + cart[i],
                success: function(data) {
                    bookInfo = data;
                    index++;
                    row_count++;
                    var row = table.insertRow(row_count);
                    var bookCell = row.insertCell(0);
                    var authorCell = row.insertCell(1);
                    var priceCell = row.insertCell(2);
                    var courseCell = row.insertCell(3);
                    var quantityCell = row.insertCell(4);
                    
                    bookCell.innerHTML = bookInfo.name;
                    authorCell.innerHTML = bookInfo.author;
                    priceCell.innerHTML = '$' + bookInfo.price + ".00";
                    courseCell.innerHTML = "<div id='toCourse-" + cart[index] + "'>" + bookInfo.courseName + "</div>";
                    quantityCell.innerHTML = "<input class='quantity' type='number' min='0' step='1' value='" + cart_quantities[cart.indexOf(cart[index])] + "'>";
                    
                    var courseHTML_id = 'toCourse-' + cart[index]; 
                    document.getElementById(courseHTML_id).addEventListener('click', function() {
                        showCoursePage(bookInfo.courseID);
                    });
                    
                },
                error: function(xhr, status, error) {
                    alert("update course broke" + xhr.responseText);
                }
            }, false);
            promises.push(request);
            
            
        }
        
        $.when.apply(null, promises).done(function(){
            console.log('done');
        });
        
    }
    
    function addUpdateListener() {
        document.getElementById('update_btn').addEventListener('click', function() {
            var q = document.getElementsByClassName('quantity');
            for (var j = 0; j < q.length; j ++) {
                if (q[j].value > 0) {
                    cart_quantities[j] = q[j].value;
                } else {
                    cart.splice(cart.indexOf(cart[j]), 1);
                    cart_quantities.splice(cart.indexOf(cart[j]), 1);
                }
            }
            document.getElementById('cart').innerHTML = "View Cart (" + cart.length + ")";
            showCartView();
        });
    }
    
    document.getElementById('account').addEventListener('click', function() {
        document.getElementById("home_view").style.display = 'none';
        document.getElementById('course_view').style.display = 'none';
        document.getElementById('cart_view').style.display = 'none';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('account_view').style.display = 'block';
        
        $.ajax({
            url: '/~jackgoodman/bookdrop/get-account.php',
            type: 'POST',
            dataType: 'JSON',
            data: "userID=" + userID,
            success: function(data) {
                document.getElementById('username_edit').value = data.username;
                document.getElementById('name_edit').value = data.name;
                document.getElementById('email_edit').value = data.email;
                document.getElementById('address_edit').value = data.address;
            },
            error: function(xhr, status, error) {
                alert("update course broke" + xhr.responseText);
            }
        });
        
        document.getElementById('edit_account_btn').addEventListener('click', function() {
            var new_username = document.getElementById('username_edit').value;
            var new_name = document.getElementById('name_edit').value;
            var new_email = document.getElementById('email_edit').value;
            var new_password = document.getElementById('password_edit').value;
            var new_address = document.getElementById('address_edit').value;
            $.ajax({
                url: '/~jackgoodman/bookdrop/update-account.php',
                type: 'POST',
                dataType: 'JSON',
                data: "userID=" + userID + "&new_username=" + new_username + "&new_name=" + new_name
                    + "&new_email=" + new_email + "&new_password=" + new_password + "&new_address=" + new_address,
                success: function(data) {
                    if (data.success) {
                        alert('Information updated!');
                    }
                    else {
                        alert('Something went wrong :(');
                    }
                },
                error: function(xhr, status, error) {
                    alert("update account broke" + xhr.responseText);
                }
            }, false);
            
            $.ajax({
                url: '/~jackgoodman/bookdrop/get-account.php',
                type: 'POST',
                dataType: 'JSON',
                data: "userID=" + userID,
                success: function(data) {
                    document.getElementById('username_edit').value = data.username;
                    document.getElementById('name_edit').value = data.name;
                    document.getElementById('email_edit').value = data.email;
                    document.getElementById('address_edit').value = data.address;
                },
                error: function(xhr, status, error) {
                    alert("update course broke" + xhr.responseText);
                }
            }, false);
        });
    });
    
    function updateView() {
        if (userID == 0) {
            document.getElementById('logged_in').style.display = 'none';
            document.getElementById('logged_out').style.display = 'block';
        }
        else {
            document.getElementById('logged_in').style.display = 'block';
            document.getElementById('logged_out').style.display = 'none';
        }
    }
});