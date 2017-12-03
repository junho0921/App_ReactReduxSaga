/**
 * Created by jiajunhe on 2016/12/17.
 */

/*action 对动态数据有影响的动作*/
/*
 * 1, 按键操作
 * 1-1, 输入或删除, 请求联想歌手
 * 1-2, 按上下键选择联想歌手
 * 1-3, 按enter键搜索歌手
 * 2, 点击联想歌手, 清空界面
 * 3, 点击搜索按钮搜索歌手, 清空界面
 * */
import {ajax} from '../../../utils/jquery.min';
import {singerDataReducer} from './reducer';

let searchData = {
	word: '',
	i: 1,
	s: 1,
	page: 1,
	pagesize: 10,
	pid:'10009'
};

/*actionType 对于修改动态数据的类型*/
export const RECEIVE_IMAGINE_SINGER = 'RECEIVE_IMAGINE_SINGER';
export const FOCUS_MOVE = 'FOCUS_MOVE';
export const RECEIVE_SINGERS = 'RECEIVE_SINGERS';
export const CLEAR_UI = 'CLEAR_UI';
export const INPUT = 'INPUT';

const SEARCHACCSONG_URL = 'http://songsearch.kugou.com/accsong_search_v2';

/*常量: action*/
// 输入框的输入值
export const input = (inputValue) => ({
  type: INPUT,
  data: inputValue || ''
});
// 输入框的关注
export const focusMove = (direction) => ({
  type: FOCUS_MOVE,
  data: direction
});
// 选择推荐歌手名
export const onSearchSongs = (singerId) => ({
  type: CLEAR_UI
});
const receiveSingerNames = (result) =>({
  type: RECEIVE_IMAGINE_SINGER,
  data: result
});
export const initSearchInput = input;

/*异步操作*/
// 请求歌手
const getSinger = (config) => new Promise((resolve, reject) =>
  ajax({
    url: SEARCHACCSONG_URL + '?platform=WebFilter&PrivilegeFilter=0&pagesize=30&keyword='+config.word+'&page=' + config.page,
    dataType: 'jsonp',
    timeout: 2000,
    success: resolve,
    error: reject,
    jsonp: 'callback'
  })
);
// 按照输入框的信息, 幻想歌手
export const imagineSinger = (dispatch, getState) => {
	const word = (getState()).Search.inputValue.trim();
	return getSinger({
    word: word,
    page: 1,
  }).then((result) => dispatch(receiveSingerNames(result)));
};

export const searchSong = (searchWord, searchPage, onSearchOut) => {
	return (dispatch) => {
		// 清理输入框内容
		dispatch({type: CLEAR_UI});
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