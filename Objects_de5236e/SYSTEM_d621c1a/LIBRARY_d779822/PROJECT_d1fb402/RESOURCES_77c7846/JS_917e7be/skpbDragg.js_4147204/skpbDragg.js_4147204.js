var color = 'yellow';
function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);
	console.log("dragStart!!!")
  event
    .currentTarget
    .style
    .backgroundColor = color;
}

function onDragOver(event) {
	event.preventDefault();
}

function onDrop(event) {
  var id = event
    .dataTransfer
    .getData('text');
   var zone = event.target
   var cureentZoneColor = window.getComputedStyle(zone).backgroundColor;
	document.getElementById("draggableSpan").style.backgroundColor = cureentZoneColor; 
  var draggableElement = document.getElementById(id);
  var dropzone = event.target;
  
  dropzone.appendChild(draggableElement);
 
  event
    .dataTransfer
    .clearData();
}


console.log(webMI.getClientInfo())