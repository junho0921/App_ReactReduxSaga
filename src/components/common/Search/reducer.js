/**
 * Created by jiajunhe on 2016/12/17.
 */
import {
	RECEIVE_IMAGINE_SINGER,
	FOCUS_MOVE,

	CLEAR_UI,

} from './action';

export function singerDataReducer (result) {
  const data = result.data,
		dataList = data.lists,
		hasSearchResult = result.status == 1 && Object.prototype.toString.call(dataList) === '[object Array]' && dataList.length > 0;
	return (hasSearchResult && result) || [];
}

const singerNamesHandler = (result) => {
  const data = result.data,
    dataList = data.lists,
    singerNames = new Set(),
    hasSearchResult = result.status == 1 && Object.prototype.toString.call(dataList) === '[object Array]' && dataList.length > 0;
  if(hasSearchResult && dataList){
    dataList.forEach((item) => {
      singerNames.add(item.singerName);
    });
    return [...singerNames];
  }
  return singerNames;
};

const initialState = {
  imagineList: [],
  focusIndex: '',
  inputValue: ''
};

export default function _reducer (state = initialState, action) {
	const data = action.data;
  console.log('_reducer', action, state);
	switch (action.type){
		case RECEIVE_IMAGINE_SINGER:
			return Object.assign({...state}, {
				imagineList: singerNamesHandler(data),
				focusIndex: -1
			});
		case FOCUS_MOVE:
      switch (data){
				case 'up':
					let newFocusIndex;
					if(state.focusIndex >= 0){
						newFocusIndex = state.focusIndex - 1;
						return Object.assign({...state}, {
              focusIndex: newFocusIndex,
              inputValue: state.imagineList[(newFocusIndex === -1) ? 0: newFocusIndex]
            });
					}
					break;
				case 'down':
					const len = state.imagineList.length;
					if(state.focusIndex < (len -1)){
						newFocusIndex = state.focusIndex + 1;
            console.log('所选择的', state.imagineList[newFocusIndex]);
            return Object.assign({...state}, {
							focusIndex: newFocusIndex,
							inputValue: state.imagineList[newFocusIndex]
						});
					}
					break;
			}
			break;
		case CLEAR_UI:
			return Object.assign({...state}, {imagineList: [], focusIndex: -1, inputValue: ''});
    default:
      return state;
	}
}
