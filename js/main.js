//定义一个获取元素的方法
var $ =function(id){
	return document.getElementById(id);
}
//给一个对象添加类名
function addClassName(ele,clazz){
	var classname = ele.style.className;
	if(classname){
		classname += 'clazz';
	}else{
		classname = 'clazz';
	}
}
var icon = document.getElementsByClassName('u-icon');
var iconClose,iconAdd,iconWrite,iconDelete;
var icon_len = icon.length;
for (var i = 0; i < icon_len; i++) {
	 if(icon[i].classList[1]=='u-add') iconAdd = icon[i];
	 if(icon[i].classList[1]=='u-close') iconClose = icon[i];
	 if(icon[i].classList[1]=='u-write') iconWrite = icon[i];
}; 
var boxCount = 1;
var noteCount = 1;
var noteType = $('noteType');
var noteTypeList = noteType.firstElementChild;
var msgBox = $('msgBox');
var msgInput = msgBox.getElementsByTagName('input')[0];
var msgButt = msgBox.getElementsByTagName('button')[0];
var noteList = $('notelist');
var listCont = $('listcont');
var newNote = iconWrite.parentNode;
var editTitle = $('edittitle');
var editBox = $('editbox');
var editButt = $('editbutt');
var editCont = editBox.parentNode;
var editTips = editButt.previousElementSibling;
console.log(editTips);
//显示对话框
function showMsgBox(){
	msgBox.style.display = 'block';
}
//关闭对话框
function closeMsgBox(){
	msgBox.style.display = 'none';
}
// 增加笔记本类型
function addNoteType(){
	var li = document.createElement('li');
	li.innerHTML = '<a href=\"#box'+ boxCount +'\">'+ msgInput.value +'</a><i class="u-icon u-delete"></i>';
	noteTypeList.insertBefore(li,iconAdd.parentNode);
	addNoteBox(boxCount);
}
//删除笔记本类型
function deleteNoteType(ele){
	noteTypeList.removeChild(ele);
	var eleHref = ele.firstElementChild.href;
	var p = eleHref.indexOf('#');
	var eleId = eleHref.slice(p+1);
	deleteNoteBox(eleId);
}
//处理笔记本类型
function handleNoteType(e){
	var eleClz = e.target.className;
	switch(eleClz){
		case 'u-icon u-delete':
			var ele = e.target.parentNode;
			deleteNoteType(ele);
			break;
		case 'u-icon u-add':
			showMsgBox();
			break;
		default:
			break;
	}
}
//创建笔记列表框
function addNoteBox(ele){
	var div = document.createElement('div');
	var ul = document.createElement('ul');
	ul.id = 'listcont';
	div.className = 'box';
	div.id = 'box'+boxCount;
	div.appendChild(ul);
	noteList.appendChild(div);
}
//删除笔记框列表
function deleteNoteBox(id){
	var ele = $(id);
	noteList.removeChild(ele);
}
//清空editbox
function clearEdit(){
	editTitle.value = '';
	editBox.value = '';
}
//处理editbox中的note
function handleStroge(){

	var title = editTitle.value;
	var cont = editBox.value;
	if(!(title && cont)){
		editTips.style.display = 'inline-block';
	}else{
	
		strogeNote(title,cont);
	}
} 
//保存提交的数据
function strogeNote(title,cont){
	var box;
	var boxes = noteList.children;
	var box_len = boxes.length;
	for (var i = 0; i < box_len; i++) {
		console.log(getComputedStyle(boxes[i]).display);
		var status = getComputedStyle(boxes[i]).display;
		if(status == 'block'){
			var noteId;
			var noteTitle;
			var noteCont;
			//把数据存储到localstorage
			noteId = boxes[i].id + 'note' + noteCount;
			noteCount++;
			noteTitle = noteId + '_title';
			noteCont = noteId + '_cont';
			localStorage.setItem(noteTitle,title);
			localStorage.setItem(noteCont,cont);
			//增加到notelist
			box = boxes[i];
			var ul = box.firstElementChild;
			console.log(box);
			var li = document.createElement('li');
			li.setAttribute('data-noteid',noteId);
			var p = document.createElement('p');
			p.innerHTML = title + '<i class="u-icon u-delete"></i>';
			li.appendChild(p);
			ul.appendChild(li); 
			clearEdit();
		}
	};
}
//删除notelist 的列表项
function deleteNoteLi(ele){
	listCont.removeChild(ele);
}
function handleNoteList(e){
	var ele = e.target;
	var eleTag = ele.tagName;
	switch(eleTag){
		case 'I':
		var eleClz = ele.className;
		var eleGrandParent = ele.parentNode.parentNode;
		if(eleClz == 'u-icon u-delete'){
			deleteNoteLi(eleGrandParent);
		}
		break;
		case 'P':
		var eleParent = ele.parentNode;
	//在editbox中写入以前的信息。
		var noteId = eleParent.getAttribute('data-noteid');
		var title = localStorage.getItem(noteId + '_title');
		var cont = localStorage.getItem(noteId + '_cont');
		debugger;
		editTitle.value = title;
		editBox.value = cont;
		break;
		default:
		break;	
	} 
}
//给笔记本父容器添加事件代理
noteTypeList.addEventListener('click',function(e){
	handleNoteType(e);
},false);
//msgbox的提交按钮事件
msgButt.addEventListener('click',function(){
	closeMsgBox();
	addNoteType();
	boxCount++;
},false)

//msgbox的关闭按钮事件
iconClose.addEventListener('click',closeMsgBox,false);
//新建笔记按钮的点击事件
newNote.addEventListener('click',clearEdit,false);
//保存按钮的点击事件
editButt.addEventListener('click',handleStroge,false);
//当input有输入时，tip消失
editCont.addEventListener('click',function(){
	editTips.style.display = 'none';
},false);
//给notelist添加事件代理
noteList.addEventListener('click',function(e){
	handleNoteList(e);

},false);
