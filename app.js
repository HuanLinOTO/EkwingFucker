import { getAnswer, getCookies, getExamList } from "./utils.js"

const cookies = getCookies();

const exam_list = getExamList(cookies);
console.log(`
作者:Github HuanLinMaster
EkwingFucker
已开始运行
`);
for(const exam of exam_list) {
    getAnswer(exam,cookies);
}