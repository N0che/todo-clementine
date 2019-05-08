import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const API_URL = 'https://jsonplaceholder.typicode.com/'

export default new Vuex.Store({
  state: {
    todos : null,
    todo  : null,
    users : null,
    user  : true 
  },
  getters: {
    getTodos: state => state.todos,
    getTodo: state => state.todo,
    getUsers: state => state.users,
    getUser: state => state.user,
  },
  mutations: {
    TODOS: (state, todos) => {
      state.todos = todos
    },
    TODO: (state, todo) => {
      state.todo = todo
    },
    SELECTED_USER: (state, user) => {
      state.user = user
    }
  },
  actions: {
    //TODO ACTIONS (that's confusing)
    createTodo: () => {
    },
    readTodos: (state) => {
      axios.get(API_URL + "todos").then(
        response => {
          state.commit('TODOS', response.data)
        }
      )
    },
    readTodo: () => {
    },
    updateTodos: () => {

    },
    updateTodo: () => {

    },
    deleteTodo: () => {

    },
    selectedTodo: () => {

    },
    //USER ACTIONS
    readUsers: () => {

    },
    readUser: () => {

    },
    selectedUser: () => {

    }
  }
})
