#生效的网页：https://i.mi.com/note/h5#/
#来源：https://www.zhihu.com/question/35329107 https://www.zhihu.com/people/mengweidefy
var text = '';
var resultArray=[];
var Ajax={
  get: function(url, fn) {
    var xhr = new XMLHttpRequest();            
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
        fn.call(this, xhr.responseText);  
      }
    };
    xhr.send();
  }
}

function sortRule(a,b) {
  return a.date.getTime()-b.date.getTime(); // 如果a>=b，返回自然数，不用交换位置
}

//下面地址中的limit参数表示最多返回200条数据，官方默认是200，最大应该也是200
//ts参数是一个时间戳，防止缓存的
function nextPage(syncTag){
	var url ='https://i.mi.com/note/full/page/?ts='+(new Date()).getTime()+'&limit=200';
	if(syncTag){
		url += '&syncTag=' + syncTag;
	}
	Ajax.get(url,
		function (r) {
			var result = JSON.parse(r);
			for(var i in result.data.entries){
				let obj = result.data.entries[i];
				let detailUrl = 'https://i.mi.com/note/note/'+obj.id+'/?ts='+(new Date()).getTime();
				Ajax.get(detailUrl,
					function (dtl) {
						var detailInfo = JSON.parse(dtl).data.entry;
						var date = new Date();
						date.setTime(obj.createDate);

						var resultObj = {};
						resultObj.date=date;
						resultObj.content=detailInfo.content;
						resultObj.folderId=detailInfo.folderId;
						resultObj.colorId=detailInfo.colorId;
						resultArray.push(resultObj);
				});
			}
			
			if(result.data.entries.length){
				nextPage(result.data.syncTag);
			}else{
                resultArray.sort(sortRule);
                text+="<table>";
				for(let j in resultArray){
                    let resObj = resultArray[j];
                    text+="<tr class='mytr'><td class='mytd'>\n\n";
                    text+='<div class="card">';
                    text += "<div>" + dateFormat(resObj.date) +"</div>";
					text += "<div style='line-height: 12px;'>-----------------------</div>";
					text += "<div></div>";
					text += '<div style="margin-left:0px;">' + resObj.content +'</div>';
					// text += "<div>----------------------------------------</div>";	
					text = text.replace(/[\n\r]/g, "<br/>");
                    text+="</div>";
                    text+="</td></tr>";
                }
                text+="</table>";
                text+=`<style>
                        .mytd{
                            padding:10px;
                            border-bottom: 1px solid #dedbdb;
                        } 
                        .mytr{} 
                        .card{
                            margin-top:30px;
                        }
                        table{}
                        
                    </style>`;
				document.write(text);
			}
		}
	);
	
				
	
}

function dateFormat( date) {
return  date.getFullYear() +"-"
        + (date.getMonth()+1).toString().padStart(2,"0") +"-"
        + date.getDate().toString().padStart(2,"0")  +" "
        + date.getHours().toString().padStart(2,"0") +":"
        + date.getMinutes().toString().padStart(2,"0") +":"
        + date.getSeconds().toString().padStart(2,"0")        
}

nextPage();
