import request from "sync-request";
export default (webhook,keyword,content) => {
    var options = {
        headers: {
            'Content-Type': 'application/json',
        },    
        body: JSON.stringify({
            "msgtype": "actionCard",
            "actionCard": {
                "title": keyword, 
                "text": content,
                "btnOrientation": "0", 
                "btns": [
                    {
                        "title": "获取更新", 
                        "actionURL": "http://cloud.nat.yinidc.cn:10489/fuckekwing"
                    }
                ]
            }
        })
      
      };
    //   console.log(webhook);
    console.log(content);
    return request("POST",webhook,options).body.toString();
      
}