/**
 * Created by jiajunhe on 2016/12/17.
 */

/*action-异步操作*/

import {ajax} from '../../../utils/jquery.min';
import {singerDataReducer} from './reducer';
import {
  resetUI,
  receiveSingerNames,
} from './action';

const SEARCH_SONG_URL = 'http://songsearch.kugou.com/accsong_search_v2';

/*常量: action*/

/*异步操作*/
// 请求歌手
const getSinger = (config) => new Promise((resolve, reject) =>
  ajax({
    url: SEARCH_SONG_URL + '?platform=WebFilter&PrivilegeFilter=0&pagesize=30&keyword='+config.word+'&page=' + config.page,
    dataType: 'jsonp',
    timeout: 2000,
    success: resolve,
    error: reject,
    jsonp: 'callback'
  })
);
// 按照输入框的信息, 幻想歌手
export const imagineSinger = (inputValue) => (dispatch) => {
  inputValue = inputValue && inputValue.trim() || '';
  // 没有输入值可以重置UI
  if(!inputValue){
    console.log('没有输入值可以重置UI');
    getSinger.successWord = '';
    return dispatch(resetUI());
  }
  // 判断是否有改变
  var changeInput = inputValue && getSinger.successWord !== inputValue;
  // 触发状态更新
  if(changeInput){
    return getSinger({
      word: inputValue,
      page: 1,
    }).then((result) => {
      // 成功请求的数据缓存起来, 用于避免重复请求
      getSinger.successWord = inputValue;
      dispatch(receiveSingerNames(result));
    });
  }else{
    return console.error('没有修改输入值');
  }
};

export const searchSong = (searchWord, searchPage, onSearchOut) => {
	return (dispatch) => {
		// 清理输入框内容
		dispatch(resetUI());
		// console.log('searchSong', searchPage, searchWord,  onSearchOut);
		if(searchWord && typeof onSearchOut == 'function'){
      return getSinger({
        word: searchWord,
        page: searchPage || 1,
      }).then((result) =>
        onSearchOut({
          data: singerDataReducer(result),
          searchWord,
          searchMaxPageIndex: result[0] && result[0].total && Math.ceil((result[0].total / 30)),
          searchPage
        })
      );
		}else{console.warn((!searchWord && '请输入搜索字符串') + (typeof onSearchOut !== 'function' && ', 并传参callback'))}
	}
};