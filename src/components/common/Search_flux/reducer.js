/**
 * Created by jiajunhe on 2016/12/17.
 */
import {
	RECEIVE_IMAGINE_SINGER,
	FOCUS_MOVE,

	INPUT,
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

export default function reducer (state, action) {
	const data = action.data;
	switch (action.type){
		case RECEIVE_IMAGINE_SINGER:
			return {
				imagineList: singerNamesHandler(data),
				focusIndex: -1
			};
		case FOCUS_MOVE:
      console.log('--> FOCUS_MOVE action = ', action);
      switch (data){
				case 'up':
					let newFocusIndex;
					if(state.focusIndex >= 0){
						newFocusIndex = state.focusIndex - 1;
						return {
							focusIndex: newFocusIndex,
							inputValue: state.imagineList[(newFocusIndex == -1) ? 0: newFocusIndex]
						};
					}
					break;
				case 'down':
					const len = state.imagineList.length;
					if(state.focusIndex < (len -1)){
						newFocusIndex = state.focusIndex + 1;
            console.log('所选择的', state.imagineList[newFocusIndex]);
            return {
							focusIndex: newFocusIndex,
							inputValue: state.imagineList[newFocusIndex]
						};
					}
					break;
			}
			break;
		case INPUT:
			const len = state.inputValue.length;
			let value = '';

			if(data === 'deleteWord' && len){
				value = state.inputValue.slice(0, len - 1);
				if(value){
					return {inputValue: value};
				}else{
					return {inputValue: value, imagineList: []};
				}
			}else if(data !=='deleteWord'){
				value = state.inputValue + data;
				return {inputValue: value};
			}
			break;
		case CLEAR_UI:
			return {imagineList: [], focusIndex: -1, inputValue: ''};
		default:
			return false;
	}
}
