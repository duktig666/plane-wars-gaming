/*
*公共的js文档
*写入公共的方法，以便于其他js文件执行
*/

/*
*获取公共的对象
*/

function getID(id) {
//   传入id
    return document.getElementById(id);//返回获取到的id对象
}

function getClass(className){
	return document.getElementsByClassName(className);
}

//不知道为何获取标签对象的公共方法失败
/*
function getTag(tagName){	
	return document.getELementsByTagName(tagName);
}
/*


/*
*改变对象的display属性
*/

//根据id改变display为block
function setBlock(id){
    getID(id).style.display="block";
}

//根据id改变display为none
function setNone(id){
    getID(id).style.display="none";
}

/*
*封装事件监听
*/

//绑定监听事件
function addEventHandler(target,type,fn){
 	if(target.addEventListener){
 		target.addEventListener(type,fn);
 	}else{
 		target.attachEvent("on"+type,fn);
 	}
}
 
//移除监听事件
function removeEventHandler(target,type,fn){
 	if(target .removeEventListener){
 		target.removeEventListener(type,fn);
 	}else{
 		target.detachEvent("on"+type,fn);
 	}
}

/*
* 封装公共的正则验证事件
*/
const emailRegex=/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/;
const phoneRegex=/^[1][3,4,5,7,8][0-9]{9}$/;
const passRegex=/^(\w){6,16}$/;      //6-16位的字母、数字、下划线
const messageCodeRegex=/^[0-9]{6}$/;
const nickNameRegex=/^[\w\u4e00-\u9fa5]{3,8}$/;//汉字字母数字下划线组成，3-8位
const chineseRegex=/^[\u4e00-\u9fa5]+$/;    //匹配中文汉字的正则

//公共的正则验证
function checkRegex(value,regex){
    if(regex.test(value)){
        return true; 
    }else{  
        return false; 
    }
}

/*ajax方法*/
function loadXMLDoc(){
    var xmlhttp;
    var txt,x,i;
    if (window.XMLHttpRequest)
    {
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();//创建XMLHttpRequest对象，用于在后台与服务器交换数
    }
    else{
    // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            xmlDoc=xmlhttp.responseXML;
            txt="";
            x=xmlDoc.getElementsByTagName("ARTIST");
            for (i=0;i<x.length;i++){
                txt=txt + x[i].childNodes[0].nodeValue + "<br>";
            }
            document.getElementById("myDiv").innerHTML=txt;
        }
    }
    xmlhttp.open("POST","cd_catalog.xml",true);
    xmlhttp.send();
}

/**
*本地localstorage的各种操作方法
*
*/
var storage;
/*判断浏览器是否支持localstorage的本地存储*/
//想要进行这个判断必须引入jquery文件
$(document).ready(function(){
    if(window.localStorage){
        storage=window.localStorage;
    }else{
        alert("浏览器不支持localstorage的本地存储");
    }
});
/*字符串存储到本地  修改本地存储（修改即为重新赋值）*/
function saveLocal(key,value){
    if(window.localStorage){
        //写入字段
        storage.setItem(key,value);
    }
}
/*读取本地存储*/
function getLocal(key){
    if(window.localStorage){
        var data=storage.getItem(key);
        return data;
    }
}
/*删除本地指定的文件*/
function deleteLocal(key){
    if(window.localStorage){   
        storage.removeItem(key);
    } 
}
/**
*封装json存储到本地localstorage的方法
*
*/
//json存储在localStorage的方法
function saveJsonLocal(jsonName,jsonObj){
    if(window.localStorage){
        var jsonData=JSON.stringify(jsonObj);
        saveLocal(jsonName,jsonData);
    }
}
//读取本地localStorage中的json字符串，将其转化为json对象并返回
function readJsonLocal(jsonObj){
    if(window.localStorage){
        var jsonData=getLocal(jsonObj);
        var json=JSON.parse(jsonData);
        return json;
    }
}

/*获取文件夹的文件路径（几乎作废的方法）*/   //现在浏览器安全机制的原因，不允许获取文件的物理路径
    function getObjectURL(file) {  
        var url = null; 
        if(file == undefined){
            return url; 
        } 
        if (window.createObjcectURL != undefined) {  
            url = window.createOjcectURL(file);  
        } else if (window.URL != undefined) {  
            url = window.URL.createObjectURL(file);  
        } else if (window.webkitURL != undefined) {  
            url = window.webkitURL.createObjectURL(file);  
        }  
        return url;  
    }














