import Vue from 'vue'
import Vuex from 'vuex'
import Api from './config/Api'
import ErrorCodes from './config/ErrorCodes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos : null,
    todo  : null,

    users : null,
    user  : null,

    errors : null
  },
  getters: {
    todos: state => state.todos,
    todo: state => state.todo,

    users: state => state.users,
    user: state => state.user,

    errors: state => {
      let formatedErrors = Array()
      if (state.errors) {
        state.errors.map(error => {
          if (ErrorCodes.hasOwnProperty(error)) {
            formatedErrors.push(ErrorCodes[error])
          } else {
            formatedErrors.push(error)
          }
        })
      }

      return formatedErrors
    },
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
    },


    ERROR: (state, key) => {
      if (!state.errors) state.errors = Array()
      state.errors.push(key)
    }
  },
  actions: {
    //TODO ACTIONS (that's confusing)
    createTodo: (state, data) => {
      if (data.title) {
        Api.post('todos', {
          userId: state.user.id,
          title: data.title,
          completed: false
        }).then(
          () => {
            state.dispatch('getTodos')
          }
        ).catch(
          state.commit('ERROR', 'API_ERROR')
        )
      } else {
        state.commit('ERROR', 'CREATE_TODO_EMPTY_TITLE')
      }
    },
    getTodos: (state) => {
      Api.get("todos").then(
        response => {
          state.commit('TODOS', response.data)
        }
      ).catch(
        state.commit('ERROR', 'API_ERROR')
      )
    },
    getTodo: (state, todoID) => {
      if (Number.isInteger(todoID)) {
        Api.get("todos/" + todoID).then(
          response => {
            state.commit('SELECTED_TODO', response.data)
          }
        ).catch(
          state.commit('ERROR', 'API_ERROR')
        )
      } else {
        state.commit('ERROR', 'READ_TODO_NOT_INT')
      }
    },
    updateTodo: () => {

    },
    deleteTodo: () => {

    },
    //USER ACTIONS
    getUsers: (state) => {
      Api.get("users").then(
        response => {
          state.commit('USERS', response.data)
        }
      ).catch(
        state.commit('ERROR', 'API_ERROR')
      )
    },
    selectedUser: (state, userID) => {
      if (Number.isInteger(userID)) {
        Api.get("todos/" + userID).then(
          response => {
            state.commit('SELECTED_USER', response.data)
          }
        ).catch(
          state.commit('ERROR', 'API_ERROR')
        )
      } else {
        state.commit('ERROR', 'READ_USER_NOT_INT')
      }
    },
    getStoredUser: (state) => {
      if (localStorage.userID) {
        state.commit('SELECTED_USER', localStorage.userID)
      }
    }
  }
})
