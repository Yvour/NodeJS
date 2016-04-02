"use strict"
function getCaption(operation) {
	var captions = {
		show_by_company : "Enter company name (all items will be shown on empty)",
		show_by_address : "Enter address (all items will be shown on empty)",
		delete_by_orderid : "Enter orderid to be deleted",
		display_frequency : "Just press 'Perform operation' to view statistics"

	};
	if (captions[operation])
		return captions[operation]
	else
		return "No operation";
}

function do_operation(event) {
	var target = event.target;
	if (target.classList.contains('operation')) {

		if (target.hasAttribute('data-operation')) {
		
			var operation = target.dataset.operation;
			document.getElementById('statistics').innerHTML = '';
			document.getElementById('parameterset').hidden = false;
			document.getElementById('operation_performer').dataset.operation = operation;
			document.getElementById('parametercaption').innerHTML = getCaption(operation);
		}
	}
   
}

function getTable(data, columns){
	var tbl = document.createElement('table');
	var tr = document.createElement('tr');
	var i, j;
	for (j = 0; j < columns.length; j++){
		var th = document.createElement('td');
		th.innerHTML = columns[j];
		tr.appendChild(th);
	}
	tbl.appendChild(tr);
	for (i = 0; i < data.length; i++){
		var tr = document.createElement('tr');
		for (j = 0; j< columns.length; j++){
			var td = document.createElement('td');
			td.innerHTML = data[i][columns[j]];
			tr.appendChild(td);
		}
		tbl.appendChild(tr);
	}
	return tbl;
}

function show_data(data){
	var stat = document.getElementById('statictics');
	var orderlist = document.getElementById('orderlist');
	var parameterset = document.getElementById('parameterset');
//	alert(JSON.stringify(data));
	if (data.mode){
		if (data.mode == 'statistics'){
			statistics.innerHTML = '';
			var tbl = getTable(data.data, ['orderedItem', 'count']);
			statistics.appendChild(tbl);
			parameterset.hidden = true;
		}
		if (data.mode == 'list'){
			orderlist.innerHTML = '';
			orderlist.appendChild(getTable(data.data,  ['orderId', 'companyName', 'customerAddress', 'orderedItem']));
			parameterset.hidden = true;
		}
	}
	
}

function perform_request(request_data){
	var operation = request_data.operation;
	var parameter = request_data.parameter;
	if (operation){
		var xhr = new XMLHttpRequest();
		

		xhr.open('POST', '/orders/performoperation', true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		var data = {operation:operation, parameter:parameter};
		xhr.onreadystatechange=function(){
			  if (xhr.readyState != 4) return

			  if (xhr.status == 200) {
                 // Showing result
			      show_data(JSON.parse(xhr.responseText));

			  } else {
			      //errors are not to be handled
				  alert('error:' + xhr.statusText);
			  }
			};

		xhr.send(JSON.stringify(data));
	}
}


function operation_performer(event) {

	var operation = event.target.dataset.operation;
	var parameter = document.getElementById('parameter');;
	perform_request({operation:operation, parameter:parameter.value});
	parameter.value = '';//clean
	

}

document.getElementById('buttonset').onclick = do_operation;
document.getElementById('operation_performer').onclick = operation_performer;
document.addEventListener("DOMContentLoaded",
 function(){
	perform_request({operation: "show_by_company"})
});