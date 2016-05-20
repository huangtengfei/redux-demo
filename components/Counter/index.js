import {createStore} from 'redux';

// 创建一个 reducer，用来改变 state
function counter(state = 0, action) {
	switch(action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default: 
			return state;
	}
}

// 创建一个 store，存放应用的状态
let store = createStore(counter);

// 手动订阅更新（也可以绑定到视图）
store.subscribe(() => {
	document.writeln(store.getState());
})

// 触发一个 action
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' }); 

// 整个数据流的过程

// store.dispatch(action) -> reducer(state, action) -> store.getState()