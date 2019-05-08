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
    user  : null 
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
    SELECTED_TODO: (state, todo) => {
      state.todo = todo
    },
    USERS: (state, users) => {
      localStorage.userID = users.id
      state.users = users
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
    readTodo: (state, todoID) => {
      if (Number.isInteger(todoID)) {
        axios.get(API_URL + "todos/" + todoID).then(
          response => {
            state.commit('SELECTED_TODO', response.data)
          }
        )
      }
    },
    updateTodos: () => {

    },
    updateTodo: () => {

    },
    deleteTodo: () => {

    },
    //USER ACTIONS
    readUsers: (state) => {
      axios.get(API_URL + "users").then(
        response => {
          state.commit('USERS', response.data)
        }
      )
    },
    readUser: (state, userID) => {
      if (Number.isInteger(userID)) {
        axios.get(API_URL + "todos/" + userID).then(
          response => {
            state.commit('SELECTED_USER', response.data)
          }
        )
      }
    },
    readStoredUser: (state) => {
      if (localStorage.userID) {
        state.commit('SELECTED_USER', localStorage.userID)
      }
    }
  }
})
