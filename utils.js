import request from "sync-request";
import getconfig from "./getconfig.js";
import fs from "fs"
import readline from "readline";
import ddBotNotify from "./ddBotNotify.js";
var config = getconfig();
function rline(path,callback){
    var fRead = fs.createReadStream(path);
    var objReadline = readline.createInterface({
        input:fRead
    });
    objReadline.on('line',function (line) {
        callback(line);
    });
    objReadline.on('close',function () {
        fs.unlink(path,()=>{})
    });
}
export const getCookies = () =>{
    var origin_cookie = request("GET",config.login).headers["set-cookie"]
    var cookies = "";
    for(const item of origin_cookie) {
        cookies += item.split(";")[0]+";";
    }
    return cookies
}
export const getExamList = (cookies) =>{
    var origin_exam_list = JSON.parse(request("GET",config.exam,{
        headers: {
            cookie: cookies
        }
    }).body.toString()).data.list;
    var exam_list = [];
    for(const item of origin_exam_list) {
        if(item.reback_type == 0) {
            exam_list.push({id:item.self_id,_id:item.id});
        }
    }
    return exam_list;
}
export const getAnswer = (exam,cookies) => {
    var eaxm_url = `https://www.ekwing.com/exam/student/examload?id=${exam.id}&_id=${exam._id}`
    var page_data = request("GET",eaxm_url,{
        headers: {
            cookie: cookies
        }
    }).body;
    fs.writeFileSync(`./temp${exam._id}.html`,page_data);
    rline(`./temp${exam._id}.html`,function(data) {
        if(data.indexOf("spoken_list") != -1) {
            var spoken_list = JSON.parse(data.substr(data.indexOf("=")+1).replaceAll(";",""));
            var FirstIndex; 
            for(var i in spoken_list) {
                FirstIndex = Number(i);
                break;
            }
            var answer = "";
            function appendanswer(content){
                answer += content + "\n\n";
                // console.log(content);
            };
            var ques_list;
            appendanswer("一，模仿朗读");
            appendanswer("自己看着念就完了");
            appendanswer("二，信息获取");
            ques_list =  spoken_list[FirstIndex+1].ques_list;
            for (var key in ques_list) {
                if(ques_list[key].answer[0][0]!=undefined) appendanswer((Number(key)+1)+"."+ques_list[key].answer[0][0]);
            }
            appendanswer("三，回答问题");
            ques_list =  spoken_list[FirstIndex+2].ques_list;
            for (var key in ques_list) {
                if(ques_list[key].answer[0][0]!=undefined) appendanswer((Number(key)+1)+"."+ques_list[key].answer[0][0]);
            }
            appendanswer("四，信息转述");
            ques_list = spoken_list[FirstIndex+3].answer[0][0];
            appendanswer(ques_list);
            appendanswer("五，询问信息");
            ques_list =  spoken_list[FirstIndex+4].ques_list;
            for (var key in ques_list) {
                if(ques_list[key].answer[0][0]!=undefined) appendanswer((Number(key)+1)+"."+ques_list[key].answer[0][0]);
            }
            console.log(ddBotNotify(config.webhook,config.keyword,answer));
        }
    });
}