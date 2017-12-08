'use strict';
import {_singerRequest} from '../utils/requestApi';

/*常量标记action*/
import {
  receiveSingers,
  loadingSingers
} from './singer';

/*异步操作*/
/*
* 请求歌手数据
* */
const getSingers = (requestData) => ((dispatch) => {
  if(!data){return false}
  // 改变页面状态
  dispatch(loadingSingers(requestData));
  // 请求数据
  return _singerRequest
    .get(requestData)
    .then((result) =>
      dispatch(receiveSingers(result, requestData))
    );
});
/*
* 获取默认的歌手列表
* */
const getDefaultSingers = getSingers;
/*
* 搜索歌手, 通过歌手名称索引字母
* */
const change_singer_initial = getSingers;
/*
* 搜索歌手, 通过歌手类别
* */
const change_singer_class = getSingers;
/*
* 搜索歌手, 通过现有歌手列表的排序变换
* */
const change_singer_sort = getSingers;
/*
* 搜索歌手, 通过现有歌手列表的换页
* */
const change_singer_page = getSingers;


/*测试: 歌手链接*/
function linkToSingerDetail(singerId){
  console.log('linkToSingerDetail', singerId);
}


// 对外输出
module.exports = {
  change_singer_class,
  change_singer_page,
  change_singer_sort,
  change_singer_initial,

  getDefaultSingers
};