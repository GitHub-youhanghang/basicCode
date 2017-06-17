/***兼容获得需要值的写法**/

(function() {
    // javascript scrollTop正解使用方法
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

})()


//容错ie的方法，将类数组转换为数组
function nodeListToArray(nodes) {
    var arr;
    try {
        // 非IE支持
        arr = [].slice.call(nodes);
        return arr;
    } catch (err) { //支持IE
        arr = [];
        for (var i = 0, length = nodes.length; i < length; i++) {
            arr.push(nodes[i]);
        }
        return arr;
    }
}

//Array.forEach implementation for IE 7,8 support..  使ie支持foreach  
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32  
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

//火狐浏览器不支持outerHtml的办法，不知道哪个版本不支持
function outerHtml(elem) {
    if (typeof elem === "string") elem = document.getElementById(elem);
    // 创建一个空div节点
    var div = document.createElement("div");
    // 将复制的elemCopy插入到空div节点中 
    div.appendChild(elem.cloneNode(true));
    // 返回div的HTML内容
    return div.innerHTML;
};
/***兼容获得需要值的写法 结束**/



/***********获得属性******************/
//获取dom的style下的属性  可以获得absolute元素的top和left
// js在获取css属性时如果标签中无style则无法直接获取css中的属性，所以需要一个方法可以做到这点。
// getStyle(obj,attr) 调用方法说明：obj为对像,attr为属性名必须兼容js中的写法
function getStyle(obj, attr) {
    var ie = !+"\v1"; //简单判断ie6~8
    if (attr == "backgroundPosition") { //IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y
        if (ie) {
            return obj.currentStyle.backgroundPositionX + " " + obj.currentStyle.backgroundPositionY;
        }
    }
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return document.defaultView.getComputedStyle(obj, null)[attr];
    }
}


/****************获得元素相对于页面位置，区别于相对窗口的位置*****************/

function getBoundingClientRect(element) {
    var scrollTop = document.documentElement.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft;
    if (element.getBoundingClientRect) {
        if (typeof arguments.callee.offset != "number") {
            var temp = document.createElement("div");
            temp.style.cssText = "position:absolute;left:0;top:0;";
            document.body.appendChild(temp);
            arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(temp);
            temp = null;
        }
        var rect = element.getBoundingClientRect();
        var offset = arguments.callee.offset;
        return {
            left: rect.left + offset,
            right: rect.right + offset,
            top: rect.top + offset,
            bottom: rect.bottom + offset
        };
    } else {
        var actualLeft = getElementLeft(element);
        var actualTop = getElementTop(element);
        return {
            left: actualLeft - scrollLeft,
            right: actualLeft + element.offsetWidth - scrollLeft,
            top: actualTop - scrollTop,
            bottom: actualTop + element.offsetHeight - scrollTop
        }
    }
}

//获得当前页面滚动的距离
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
/**************选择器***************/

//getElementsByClassName 方法支持ie8,7。对没有getElementsByClassName方法的浏览器版本添加上这个方法
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}

//获取id 传入 #+id
//获取class 传入 .+class
//获取标签 传入 标签名
function $(obj) {
    var which = obj.substr(0, 1);
    var newName = obj.split(which)[1];
    if (which == '#') {
        return document.getElementById(newName);
    } else
    if (which == '.') {
        return document.getElementsByClassName(newName);
    } else {
        return document.getElementsByTagName(obj);
    }
}


/****************文档处理*****************/

//var strHtml='';
//用 node.innerHTML=;

//内部处理


// javascript追加html实现类似jQuery中append方法

// $('.outer')[0].innerHTML+='<span>111</span>';


/************筛选****************/



//过滤
//获得当前元素在父元素的索引
function getItemIndex(current, obj) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i] == current) {
            return i;
        }
    }
}

function hasClass(obj, cls) { // 判断obj是否有此class
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) { //给 obj添加class
    if (!this.hasClass(obj, cls)) {
        obj.className += " " + cls;
    }
}

function removeClass(obj, cls) { //移除obj对应的class
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, " ");
    }
}



//查找
//获取元素的兄弟节点
function siblings(o) { //参数o就是想取谁的兄弟节点，就把那个元素传进去
    var a = []; //定义一个数组，用来存储o的兄弟元素
    //previousSibling返回位于相同节点树层级的前一个元素
    var p = o.previousSibling;
    while (p) { //先取o的前面的兄弟元素 判断有没有上一个兄弟元素，如果有则往下执行，p表示previousSibling
        if (p.nodeType === 1) {
            a.push(p);
        }
        p = p.previousSibling //最后把上一个节点赋给p
    }
    a.reverse(); //把顺序反转一下，这样元素的顺序就是按先后的了
    //nextSibling返回位于相同节点树层级的下一个节点
    var n = o.nextSibling; //再取o下面的兄弟元素
    while (n) { //判断有没有下一个兄弟结点，n是nextSibling的意思
        if (n.nodeType === 1) { //判断是否是元素节点
            a.push(n);
        }
        n = n.nextSibling;
    }
    return a //最后按从老大到老小的顺序，把这一组元素返回
}

/**
 * 获取下一个元素结点
 * @param {Object} node  兄结点
 * @return {Object || null}下一个元素结点或未获取到
 */
function getNextElement(node) {
    if (node.nextSibling.nodeType == 1) { //判断下一个节点类型为1则是“元素”节点   
        return node.nextSibling;
    }
    if (node.nextSibling.nodeType == 3) { //判断下一个节点类型为3则是“文本”节点  ，回调自身函数  
        return getNextElement(node.nextSibling);
    }
    return null;
}

function getChildNodes(ele) {
    //为了提高代码的兼容性，避免个别浏览器不支持 children 或 childNodes 的情况，可以这样编写代码：
    var childArr = ele.children || ele.childNodes;
    childArrTem = new Array(); //  临时数组，用来存储符合条件的节点
    for (var i = 0, len = childArr.length; i < len; i++) {
        if (childArr[i].nodeType == 1) {
            childArrTem.push(childArr[i]); // push() 方法将节点添加到数组尾部
        }
    }
    return childArrTem;
}

//获取元素的兄弟节点
function siblings(o) { //参数o就是想取谁的兄弟节点，就把那个元素传进去
    var a = []; //定义一个数组，用来存储o的兄弟元素
    //previousSibling返回位于相同节点树层级的前一个元素
    var p = o.previousSibling;
    while (p) { //先取o的前面的兄弟元素 判断有没有上一个兄弟元素，如果有则往下执行，p表示previousSibling
        if (p.nodeType === 1) {
            a.push(p);
        }
        p = p.previousSibling //最后把上一个节点赋给p
    }
    a.reverse(); //把顺序反转一下，这样元素的顺序就是按先后的了
    //nextSibling返回位于相同节点树层级的下一个节点
    var n = o.nextSibling; //再取o下面的兄弟元素
    while (n) { //判断有没有下一个兄弟结点，n是nextSibling的意思
        if (n.nodeType === 1) { //判断是否是元素节点
            a.push(n);
        }
        n = n.nextSibling;
    }
    return a //最后按从老大到老小的顺序，把这一组元素返回
}

/*************效果******************/

function animate(obj, json, interval, sp, fn) {
    clearInterval(obj.timer);
    //var k = 0;
    //var j = 0;
    function getStyle(obj, arr) {
        if (obj.currentStyle) {
            return obj.currentStyle[arr]; //针对ie
        } else {
            return document.defaultView.getComputedStyle(obj, null)[arr];
        }
    }
    obj.timer = setInterval(function() {
        //j ++;
        var flag = true;
        for (var arr in json) {
            var icur = 0;
            //k++;
            if (arr == "opacity") {
                icur = Math.round(parseFloat(getStyle(obj, arr)) * 100);
            } else {
                icur = parseInt(getStyle(obj, arr));
            }
            var speed = (json[arr] - icur) * sp;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (icur != json[arr]) {
                flag = false;
            }
            if (arr == "opacity") {
                obj.style.filter = "alpha(opacity : '+(icur + speed)+' )";
                obj.style.opacity = (icur + speed) / 100;
            } else {
                obj.style[arr] = icur + speed + "px";
            }
            //console.log(j + "," + arr +":"+ flag);
        }

        if (flag) {
            clearInterval(obj.timer);
            //console.log(j + ":" + flag); 
            //console.log("k = " + k);
            //console.log("j = " + j);
            //console.log("DONE");
            if (fn) {
                fn();
            }
        }
    }, interval);
}
/***************ajax*******************/

// 原生ajax

//get get get
// 使用 GET 请求经常会发生的一个错误，就是查询字符串的格式有问题。查询字符串中每个参数的名
// 称和值都必须使用 encodeURIComponent()进行编码，然后才能放到 URL 的末尾；而且所有名-值对
// 儿都必须由和号（&）分隔，如下面的例子所示。
// xhr.open("get", "example.php?name1=value1&name2=value2", true);

// 下面这个函数可以辅助向现有 URL 的末尾添加查询字符串参数：
function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

// 下面是使用这个函数来构建请求 URL 的示例。
// var url = "example.php";
// //添加参数
// url = addURLParam(url, "name", "Nicholas");
// url = addURLParam(url, "book", "Professional JavaScript");
// //初始化请求
// xhr.open("get", url, false);
// 在这里使用 addURLParam()函数可以确保查询字符串的格式良好，并可靠地用于 XHR 对象。



//get 请求实例

// var xhr = createXHR();
// xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4) {
//         if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//             alert(xhr.responseText);
//         } else {
//             alert("Request was unsuccessful: " + xhr.status);
//         }
//     }
// };
// var url = "/myweb/public/index/index/hello";
// //添加参数

// url = addURLParam(url, "book", "Professional JavaScript");
// xhr.open("get", url, false);
// xhr.send(null);

//post post post
// 这个函数中新增的代码首先检测原生 XHR 对象是否存在，如果存在则返回它的新实例。如果原生
// 对象不存在，则检测 ActiveX 对象。如果这两种对象都不存在，就抛出一个错误。然后，就可以使用下
// 面的代码在所有浏览器中创建 XHR 对象了。
// var xhr = createXHR();
// 由于其他浏览器中对 XHR 的实现与 IE 最早的实现是兼容的，因此就可以在所有浏览器中都以相同
// 方式使用上面创建的 xhr 对象
function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                    "MSXML2.XMLHttp"
                ],
                i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {
                    //跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR object available.");
    }
}

// 我们可以使用 XHR 来模仿表单提
// 交：首先将 Content-Type 头部信息设置为 application/x-www-form-urlencoded，也就是表单
// 提交时的内容类型，其次是以适当的格式创建一个字符串。第 14 章曾经讨论过， POST 数据的格式与查
// 询字符串格式相同。如果需要将页面中表单的数据进行序列化，然后再通过 XHR 发送到服务器，那么
// 就可以使用第 14 章介绍的 serialize()函数来创建这个字符串


//post实例

// function submitData() {
//     var xhr = createXHR();
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                 alert(xhr.responseText);
//             } else {
//                 alert("Request was unsuccessful: " + xhr.status);
//             }
//         }
//     };
//     xhr.open("post", "/myweb/public/index/index/hello", true);
//     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//     var form = document.getElementById("form1");
//     xhr.send(serialize(form));
//     console.log('zhixingle')
// }
// submitData();
/*************其他****************/

function serialize(form) {
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;

    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];

        switch (field.type) {
            case "select-one":
            case "select-multiple":

                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = "";
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute("value") ? option.value : option.text);
                            } else {
                                optValue = (option.attributes["value"].specified ? option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
                    }
                }
                break;

            case undefined: //fieldset
            case "file": //file input
            case "submit": //submit button
            case "reset": //reset button
            case "button": //custom button
                break;

            case "radio": //radio button
            case "checkbox": //checkbox
                if (!field.checked) {
                    break;
                }
                /* falls through */

            default:
                //don't include form fields without names
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join("&");
}
