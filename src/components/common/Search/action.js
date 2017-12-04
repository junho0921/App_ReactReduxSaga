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
/*actionType 对于修改动态数据的类型*/
export const RECEIVE_IMAGINE_SINGER = 'RECEIVE_IMAGINE_SINGER';
export const FOCUS_MOVE = 'FOCUS_MOVE';
export const RECEIVE_SINGERS = 'RECEIVE_SINGERS';
export const CLEAR_UI = 'CLEAR_UI';

/*常量: action*/
// 输入框的关注
export const focusMove = (direction) => ({
  type: FOCUS_MOVE,
  data: direction
});
// 重置UI
export const resetUI = (singerId) => ({
  type: CLEAR_UI
});
export const receiveSingerNames = (result) =>({
  type: RECEIVE_IMAGINE_SINGER,
  data: result
});

/*异步操作*/
export const IMAGINE_SINGER = 'IMAGINE_SINGER';
export const SEARCH_SONG = 'SEARCH_SONG';
// 按照输入框的信息, 幻想歌手
export const imagineSinger = (inputValue) => ({
  type: IMAGINE_SINGER,
  data: inputValue
});
// 搜索歌曲
export const searchSong = () => ({
  type: SEARCH_SONG
});