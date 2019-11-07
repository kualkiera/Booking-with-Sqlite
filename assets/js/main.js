var sel_parkid = '';
$(document).ready(function () {
    var db = openDatabase('cos_ccd_parking', '1.0', 'Test DB', 4 * 1024 * 1024);
    
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS parking_bays (id unique, bay_title)');
        tx.executeSql('INSERT INTO parking_bays (id, bay_title) VALUES (1, "PARK 1")');
        tx.executeSql('INSERT INTO parking_bays (id, bay_title) VALUES (2, "PARK 2")');
    });

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS bookings (id unique, bay_id, date, name, number, reservation_start_time, reservation_finish_time, number_plate)');
        tx.executeSql('INSERT INTO bookings (id, bay_id, date, name,number, reservation_start_time, reservation_finish_time, number_plate) VALUES (1, 1, "2019-10-31", "john", 1, "07:00", "19:00", "7TRR859")');
    });

    $(function() {
        $('.calendar').pignoseCalendar();
    });

    $('.select-name').select2();
    $('.select-time').select2();

    $(document).on("click", ".btn-edit",function(event) {
        console.log(this.parentNode.parentNode);
        $row = $(this.parentNode.parentNode);
        var val = $row.children('.img').attr('data-status');
        if(val == 'checked')
            $row.children('.park-checkbox').prop("checked", true);

        $(this.parentNode).children('.btn-edit').css("display", "none");
        $(this.parentNode).children('.btn-delete').css("display", "none");
        $(this.parentNode).children('.btn-save').css("visibility", "visible");
        $(this.parentNode).children('.btn-cancel').css("visibility", "visible");

        $('.park-checkbox').css("visibility", "visible");
        
        $('.img').css("display", "none");
    });

    $(document).on("mouseenter", ".td_btn", function (event) {
        $(this).children('.btn-edit').css("visibility", "visible");
        $(this).children('.btn-delete').css("visibility", "visible");
    });

    $(document).on("click", ".btn-delete",function(event) {
        var row = this.parentNode.parentNode;
        row.parentNode.removeChild(row);  
    });
        
    $(document).on("mouseleave", ".td_btn", function (event) {
        $(this).children('.btn-edit').css("visibility", "hidden");
        $(this).children('.btn-delete').css("visibility", "hidden");
    });
    

    $(document).on("click", ".btn-cancel",function(event) {

        $('.btn-edit').css("display", "initial");
        $('.btn-delete').css("display", "initial");
        $('.btn-edit').css("visibility", "hidden");
        $('.btn-delete').css("visibility", "hidden");
        $('.btn-save').css("visibility", "hidden");
        $('.btn-cancel').css("visibility", "hidden");
        $('.park-checkbox').css("visibility", "hidden");
        $('.img').css("display", "initial");
    });

    $(document).on("click", ".btn-add",function(event) {
        var d = new Date();
        var res_date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        var user_name = $("#username").val();
        var phone_number = $("#phonenumber").val();
        var licenseplace = $("#licenseplace").val();
        var from_time = $("#from").val();
        var to_time = $("#to").val();

        // console.log(user_name+"--"+phone_number+"--"+licenseplace+"--"+from_time+"--"+to_time+"--"+res_date);
        // console.log(sel_parkid);
        // db.transaction(function (tx) {
        //     tx.executeSql('INSERT INTO bookings (id, bay_id, date, name,number, reservation_start_time, reservation_finish_time, number_plate) VALUES (?, ?,?,?,?,?,?,?)', [3,3,res_date,user_name,phone_number,from_time,to_time,licenseplace]);
        // });

        addField(this);
    });

    $('.btn-park').click(function(event) {
        timeRend();
    });

    // db.transaction(function (tx) { 
    //     tx.executeSql('SELECT * FROM parking_bays', [], function (tx, results) {
            
    //         var len = results.rows.length, i;
    //         var button_row = document.getElementById("park-tr");
    //         for (i = len-1; i >= 0; i--) {
    //             var x = button_row.insertCell(2);
    //             x.innerHTML = "<button type='button' class='btn btn-park' data-toggle='modal' data-target='#register-modal' onclick='timeRend();'>"+results.rows.item(i).bay_title+"</button><input type='hidden' id='park' value='"+results.rows.item(i).id+"'/>";
    //             x.style= "text-align: center;";
    //         }
    //     }, null); 
    // });

    db.transaction(function (tx) { 
        var park_id = [];            
        tx.executeSql('SELECT * FROM parking_bays', [], function (tx, results) {
            var len = results.rows.length, i;      
            for (i = 0; i < len; i++) {
                park_id.push(results.rows.item(i).id);
            }
        }, null); 
        
        tx.executeSql('SELECT * FROM bookings', [], function (tx, results) { 
            var lenchk = results.rows.length, i;      
            var check_row = document.getElementById("check-tr");
            var myTable = document.getElementById("users-table");

            for (i = lenchk-1; i >= 0; i--) {
                cell1 = "<th class='fixed-side'><img src='./assets/img/user.png' class='avatar-img bg-img-2'></th>";
                cell2 = "<td>"+results.rows.item(i).name+"</td>";
                cell3 = "<td class='text-center'><img src='./assets/img/tick@2x.png' width='16' class='img'><input type='checkbox' id='park1' style='visibility: hidden;'></td>";
                cell4 = "<td class='text-center'><img src='./assets/img/nope@2x.png' width='16' class='img'><input type='checkbox' id='park1' style='visibility: hidden;'></td>"
                cell11 = "<td class='d-flex pt-2 td_btn'><button type='button' class='btn btn-light btn-edit' style='visibility: hidden;'>Edit</button><button type='button' class='btn btn-light text-danger btn-delete' style='visibility: hidden;'>Delete</button><button type='button' class='btn btn-light btn-save' style='visibility: hidden;'>Edit</button><button type='button' class='btn btn-light btn-cancel' style='visibility: hidden;'>Delete</button></td>";
                check_row.insertCell(0);
                $(myTable).append("<tr>\n" +cell1 + cell2 + cell3 + cell4 + cell11 + "</tr>\n");
                myTable.style= "text-align: center;";
            }
        }, null);
    });


});

function addField () {
    var myTable = document.getElementById("users-table");

    cell1 = "<th class='fixed-side' style='text-align: center;'><img src='./assets/img/user.png' class='avatar-img bg-img-2'></th>";
    cell2 = "<td>Jone Example</td>";
    cell3 = "<td class='text-center'><img src='./assets/img/tick@2x.png' width='16' class='img'><input type='checkbox' id='park1' style='visibility: hidden;' data-status='checked'></td>";
    cell4 = "<td class='text-center'><img src='./assets/img/nope@2x.png' width='16' class='img'><input type='checkbox' id='park2' style='visibility: hidden;' data-status=''></td>";
    cell11 = "<td class='d-flex pt-4 td_btn'><button type='button' class='btn btn-light btn-edit' style='visibility: hidden;'>Edit</button><button type='button' class='btn btn-light text-danger btn-delete' style='visibility: hidden;'>Delete</button><button type='button' class='btn btn-light btn-save' style='visibility: hidden;'>Edit</button><button type='button' class='btn btn-light btn-cancel' style='visibility: hidden;'>Delete</button></td>";

    $(myTable).append(
        "<tr>\n" +
        cell1 +
        cell2 + 
        cell3 + 
        cell4 +
        cell11 +
        "</tr>\n"
      );
}

function timeRend(){
    var i;
    var select_from = document.getElementById("from");
    var select_to = document.getElementById("to");
    for (i = 0; i < 24; i++) {
        if(i<10)
        {
            var time = "0" + i;
            select_from.innerHTML += "<option>" + time + ":00</option>";
        }
        else
        {
            select_from.innerHTML += "<option>" + i + ":00</option>";
        }        
    }
    for (i = 0; i < 24; i++) {
        if(i<10)
        {
            var time = "0" + i;
            select_to.innerHTML += "<option>" + time + ":00</option>";
        }
        else
        {
            select_to.innerHTML += "<option>" + i + ":00</option>";
        }        
    }
}
