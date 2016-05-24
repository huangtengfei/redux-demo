# Redux Demo

这是一个基于 [React + Webpack + ES6 组合开发的种子项目][1] 做的一个 Redux Demo，也是我学习 Redux 的过程。

## 安装 & 运行：

```
git clone https://github.com/huangtengfei/redux-demo.git
cd redux-demo
npm install
npm run dev
```

打开 http://localhost:8080 即可看到效果。

## 实现过程

a. 首先，明确应用中对象的结构。对于 todo，需要保存两种数据，所有的任务 `todos` 和 筛选条件 `filter`，这些就是要定义在 state 中的。

b. 明确应用需要哪些操作。对于 todo，有新建 todo、切换 todo 状态和设置筛选条件三种，写好 actions。

c. 明确当有 action 发生时，state 是如何相应改变的。比如新建 todo，就在 todos 中加一条；改变筛选条件时，就将 filter 改成新的条件。根据 state 字段的不同，拆分成不同的 reducer 处理，写好 reducers。

d. 在 store 中将 actions 和 reducers 联系在一起。此时还没有应用的界面，但可以测试一下数据处理逻辑。这个文件通常是 **应用的入口**。

e. 写 React 组件。要注意，首先想好哪些是容器组件（聪明组件），哪些是展示组件（傻瓜组件）。容器组件一般是在最上层，它从 Redux 获取 state 并向 Redux 派发 actions，这个文件也通常是 **组件的入口**。展示组件会根据应用的大小进行拆分，比如对于 todo，拆成 AddTodo、TodoList、Todo 和 TodoFilter 四个展示组件，它们从 props 获取数据和调用回调函数。

f. 连接到 Redux。主要有两步，一步是在 应用的入口 文件中将根组件包在 `<Provider>` 中；一步是在 组件的入口 文件中用 `connect()` 包装组件，将前面写 React 组件模拟用的 state 数据源替换成包装组件从 Redux 获取的 state。

这样实现下来，一个简单的 Redux Demo 的目录结构大概如此：

```
--redux-demo
  |--components（组件目录）
    |--Todo
      |--actions.js
      |--reducers.js
      |--index.js （应用的入口）
      |--AddTodo.jsx
      |--TodoList.jsx
      |--Todo.jsx
      |--TodoFilter.jsx
      |--App.jsx （组件的入口）
      |--index.less
    |--index.js（入口文件）
  |--build（输出目录）
    |--index.html
    |--bundle.js（输出文件，由 webpack 打包后生成的）
  |--package.json
  |--webpack.config.js
```

下面内容是我学习 Redux 的笔记和总结。

## Redux 基础

与 Flux 相比，Redux 将 Dispatcher 和 Action、Store 解耦，使 Action 变成了一个纯粹的简单对象，使 Store 变成了一个 pure function（no side-effects，对一个相同的输入无论何时总返回相同结果）。

Redux 有三个基本原则：

- 整个应用只有一个数据源，即 Store
- State 只能通过触发 action 来更改
- State 的更改必须写成 pure function（称作 reducer），每次更改总返回一个新的 State

Redux 单向数据流的过程：

    store.dispatch(action) -> reducer(state, action) -> store.getState()

下面分别对 Action、Reducer 和 Store 进行简单介绍。

### Action

Action 是 Store 数据（用户输入的数据或服务器响应的数据）的唯一来源。通过 `store.dispatch()` 将 action 传给 store 。

Action 就是一个普通的 JavaScript 对象，并且通常有一个 type 字段（字符串常量）表示将要执行的动作。

示例代码：

```javascript
const ADD_TODO = 'ADD_TODO';
// 如果应用规模比较大时，可使用单独模块存放 action
// import { ADD_TODO, REMOVE_TODO } from './actionTypes'

{
    type: ADD_TODO
    text: 'Build a Redux app'
}
```

应尽量减少在 action 中传递的数据，比如只传递对象的 `id` 或在数组中的 `index` 。

在实际开发中，会使用 Action 创建函数来生成 Action，它是一个 pure function，返回一个 action 对象。

示例代码（详细代码查看 `actions.js` ）：

```javascript
function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}

store.dispatch(addTodo(text))
// 也可以把创建 action 和分发 action 的过程结合到一起
// const boundAddTodo = (text) => store.dispatch(addTodo(text));
// boundAddTodo(text);
```

### Reducer

Reducer 用来处理对 Action 对状态树的更改，接收旧的 state 和 action，返回新的 state，形如：

    (oldState, action) => newState

同 Action Creators 一样，Reducer 也是一个 pure function，为了保持它的纯净，不要在 reducer 中执行诸如修改 state 参数、API 请求和路由跳转、调用不纯的函数（如 `Date.now()`）等操作。

使用 ES6 的 `Object.assign({}, oldState, { a: 'modified a' })` 或者 ES7 的 Object Spread 操作 `{ ...oldState, a: 'modified a' }`  可以建一个副本，避免直接对 state 参数的修改。

示例代码：

```javascript
const initialState = {
    filter: Filters.SHOW_ALL,
    todos: []
}

function todoApp(state = initialState, action) {
    switch(action.type){
        case ADD_TODO: 
            return [ 
                ...state.todos,
                {
                    text: action.text,
                    completed: false
                }
            ]
        default: 
            return state
    }
}
```

由于 Redux 只有一个 Store，对应一个 State 状态。如果整个 State 由一个 reducer 维护，所有的状态更改逻辑都放在这个 reducer 里面，会变得难以维护。所以，可以进行 reducer 的拆分，让一个 reducer 只管理状态树上的一个字段，再使用 Redux 的 `combineReducers` 函数合并 reducers。比如可以把 TodoApp 的 filter 和 todos 两个 state 分别各用一个 reducer 来处理。

示例代码（详细代码查看 `reducers.js` ）：

```javascript
function filter(state = SHOW_ALL, action) {
    switch(action.type) {
        case SET_VISIBILITY_FILTER:
            ...   
    }
}

function todos(state = [], action) {
    switch(action.type) {
        case ADD_TODO:
            ...
    }
}

const todoApp = combineReducers({
    filter,
    todos
})
```

### Store

Store 是把 Action 和 Reducer 联系到一起的对象。它的作用是：

- 持有整个应用的 state
- 提供 `getState()` 方法获取 state
- 提供 `dispatch()` 方法发送 action 更新 state
- 提供 `subscribe()` 方法注册回调函数监听 action，并返回一个函数用来注销监听

示例代码（详细代码查看 `index.js` ）：

```javascript
// 创建一个 store
let store = createStore(todoApp)

// 注册回调函数监听 action
let unsubscribe = store.subscribe(() => {
    console.log(store.getState())
})

// 发送 action
store.dispatch(addTodo('Build a Redux app'));

// 取消监听
unsubscribe()
```

一个 Redux 应用只有一个 Store，在拆分处理逻辑时，应该使用 Reducers 组合而不是使用多个 Store 。

## 搭配 React

Redux 和 React 之间并没有关系，Redux 默认也不包含 React 绑定库，要搭配 React 使用，先安装 `react-redux`

    npm install --save react-redux

react-redux 的思想是将容器（Smart/Container Components）组件和展示组件分离开，只在最顶层使用 Redux（使用 `state` 数据源），其余内部组件（Dumb/Presentational Components）仅仅是展示性的，所有数据通过 `props` 传入。

react-redux 只有两个 API，即 `<Provider>` 和 `Connect` 。

### Provider

`<Provider>` 是一个容器组件，用来接收 Store ，并且让 Store 能对子组件可用，形如：

```javascript
render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
)
```

### Connect

`Connect` 用来将包装好的组件连接到 Redux 。它最多接收 [4 个可选参数][2]，返回一个函数，用这个函数接收一个组件类作为参数，最后返回一个和 Redux 关联起来的新组件，形如：

```javascript
class App extends Component { ... }

export default connect()(App);
```

从技术上讲可以将任何一个组件 `connect()` 到 Redux Store，但这会使数据流难以追踪，所以尽量只对顶层组件做这个操作。

## 补充

### 为什么调用了 `this.setState` 但 `state` 未改变

`this.setState` 不会立即改变 state ，而是一个异步过程。在调用 `this.setState` 后马上调用 `this.state` 得到的是当前的 state  。所以，如果有依赖于更新后的 state 的操作，可以放在回调中：

```javascript
this.setState({ myVal: 'newVal'}, function() {
    // do something with new state
});
```

参考 [官方 API][3] 和 [Why calling react setState method doesn't mutate the state immediately?][4] 

## 参考

[Redux 中文文档][5]


  [1]: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
  [2]: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
  [3]: https://facebook.github.io/react/docs/component-api.html
  [4]: http://stackoverflow.com/questions/30782948/why-calling-react-setstate-method-doesnt-mutate-the-state-immediately
  [5]: http://cn.redux.js.org/index.html