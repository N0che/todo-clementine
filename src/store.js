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
      state.users = users
    },
    SELECTED_USER: (state, user) => {
      localStorage.setItem('userID', user.id)
      state.user = user
    },


    ERROR: (state, key) => {
      if (!state.errors) state.errors = Array()
      state.errors.push(key)
    },
    EMPTY_ERROR: (state) => {
      state.errors = null
    }
  },
  actions: {
    //TODO ACTIONS (that's confusing)
    createTodo ({ commit, dispatch, state }, data) {
      if (data.title) {
        Api.post('todos', {
          userId: state.user.id,
          title: data.title,
          completed: false
        }).then(
          () => {
            dispatch('getTodos')
          }
        ).catch(
          commit('ERROR', 'API_ERROR')
        )
      } else {
        commit('ERROR', 'TODO_EMPTY_TITLE')
      }
    },
    getTodos ({ commit }) {
      Api.get("todos").then(
        response => {
          commit('TODOS', response.data)
        }
      ).catch(
        commit('ERROR', 'API_ERROR')
      )
    },
    getTodo ({ commit }, todoID) {
      if (Number.isInteger(todoID)) {
        Api.get("todos/" + todoID).then(
          response => {
            commit('SELECTED_TODO', response.data)
          }
        ).catch(
          commit('ERROR', 'API_ERROR')
        )
      } else {
        commit('ERROR', 'READ_TODO_NOT_INT')
      }
    },
    updateTodo ({ commit, dispatch }, data) {
      if (data.title) {
        Api.post('todos/' + data.id, {
          title: data.title,
          completed: data.completed
        }).then(
          () => {
            dispatch('getTodos')
          }
        ).catch(
          commit('ERROR', 'API_ERROR')
        )
      } else {
        commit('ERROR', 'TODO_EMPTY_TITLE')
      }
    },
    deleteTodo ({ commit, dispatch }, todo) {
      Api.delete('todos/' + todo.id).then(
        () => {
          dispatch('getTodos')
        }
      ).catch(
        commit('ERROR', 'API_ERROR')
      )
    },
    //USER ACTIONS
    getUsers ({ commit }) {
      Api.get("users").then(
        response => {
          commit('USERS', response.data)
        }
      ).catch(
        commit('ERROR', 'API_ERROR')
      )
    },
    selectedUser ({ commit }, userID){
      if (Number.isInteger(userID)) {
        Api.get("users/" + userID).then(
          response => {
            commit('SELECTED_USER', response.data)
          }
        ).catch(
          commit('ERROR', 'API_ERROR')
        )
      } else {
        commit('ERROR', 'READ_USER_NOT_INT')
      }
    },
    getStoredUser ({ dispatch }) {
      if (localStorage.getItem('userID')) {
        dispatch('selectedUser', parseInt(localStorage.getItem('userID')))
      }
    },
    //ERRORS ACTION
    emptyError: ({ commit }) => {
      commit("EMPTY_ERRORS")
    }
  }
})
