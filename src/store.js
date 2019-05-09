import Vue from 'vue'
import Vuex from 'vuex'
import Api from './config/Api'
import ErrorCodes from './config/ErrorCodes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos : null,
    selectedTodo  : {
      id : 0,
      userId : null,
      title : "",
      completed : false
    },

    users : null,
    user  : null,

    errors : null
  },
  getters: {
    todos: state => state.todos,
    selectedTodo: state => {
      if (state.selectedTodo) {
        return state.selectedTodo
      }
    },

    user: state => state.user,

    errors: state => {
      let formatedErrors = {}
      if (state.errors) {
        Object.entries(state.errors).map(error => {
          if (ErrorCodes.hasOwnProperty(error[0])) {
            formatedErrors[error[0]] = ErrorCodes[error[1]]
          } else {
            formatedErrors[error[0]] = error[1]
          }
        })
      }

      return formatedErrors
    },
  },
  mutations: {
    TODOS: (state, todos) => {
      todos.map(todo => {
        let tag = ""
        if (todo.title.indexOf('#important') != -1) {
          tag = 'important'
          todo.title.replace('#important', '')
        } else if (todo.title.indexOf('#later') != -1) {
          tag = 'later'
          todo.title.replace('#later', '')
        } else {
          tag = 'later'
        }
        
        todo.tag = tag
      })

      state.todos = todos
    },
    SELECTED_TODO: (state, todo) => {
      state.selectedTodo = todo
    },
    RESET_SELECTED_TODO: (state) => {
      Vue.set(state.selectedTodo, "id", 0)
      Vue.set(state.selectedTodo, "userId", state.user.id)
      Vue.set(state.selectedTodo, "title", "")
      Vue.set(state.selectedTodo, "completed", false)
    },
    
    SELECTED_USER: (state, user) => {
      if (user) {
        localStorage.setItem('userID', user.id)
      }
      state.user = user
    },


    ADD_ERROR: (state, key) => {
      if (!state.errors) state.errors = {}
      Vue.set(state.errors, key, key)
    },
    ERASE_ERROR: (state, key) => {
      if (state.errors.hasOwnProperty(key))
        Vue.delete(state.errors, key)
      
      if (state.errors.lenght == 0)
        state.errors = null
    }
  },
  actions: {
    //TODO ACTIONS (that's confusing)
    resetSelectedTodo ({ commit }) {
      commit('RESET_SELECTED_TODO')
    },
    createTodo ({ commit, dispatch, state }, data) {
      if (data.title) {
        Api.post('todos', {
          userId: state.user.id,
          title: data.title,
          completed: false
        }).then(
          () => {
            dispatch('getTodos')
          },
           // eslint-disable-next-line
           err => {
            commit('ADD_ERROR', 'API_ERROR')
          }
        )
      } else {
         commit('ADD_ERROR', 'TODO_EMPTY_TITLE')
      }
    },
    getTodos ({ commit }) {
      Api.get("todos").then(
        response => {
          commit('TODOS', response.data)
        },
         // eslint-disable-next-line
         err => {
           commit('ADD_ERROR', 'API_ERROR')
        }
      )
    },
    getSelectedTodo ({ commit }, todoID) {
      if (Number.isInteger(todoID)) {
        Api.get("todos/" + todoID).then(
          response => {
            commit('SELECTED_TODO', response.data)
          },
           // eslint-disable-next-line
           err => {
             commit('ADD_ERROR', 'API_ERROR')
          }
        )
      } else {
         commit('ADD_ERROR', 'READ_TODO_NOT_INT')
      }
    },
    updateTodo ({ commit, dispatch }, data) {
      if (data.title) {
        Api.put('todos/' + data.id, {
          title: data.title + " #" + data.tag,
          completed: data.completed || false
        }).then(
          () => {
            dispatch('getTodos')
          },
           // eslint-disable-next-line
           err => {
             commit('ADD_ERROR', 'API_ERROR')
          }
        )
      } else {
         commit('ADD_ERROR', 'TODO_EMPTY_TITLE')
      }
    },
    deleteTodo ({ commit, dispatch }, todo) {
      Api.delete('todos/' + todo.id).then(
        () => {
          dispatch('getTodos')
        },
         // eslint-disable-next-line
         err => {
           commit('ADD_ERROR', 'API_ERROR')
        }
      )
    },
    //USER ACTIONS
    selectedUser ({ commit }, userID){
      if (Number.isInteger(userID)) {
        Api.get("users/" + userID).then(
          response => {
            commit('SELECTED_USER', response.data)
            commit('RESET_SELECTED_TODO')
          },
           // eslint-disable-next-line
           err => {
             commit('ADD_ERROR', 'API_ERROR')
          }
        )
      }
    },
    editSelectedUser ({ commit }) {
      commit('SELECTED_USER', null)
    },
    getStoredUser ({ dispatch }) {
      if (localStorage.getItem('userID')) {
        dispatch('selectedUser', parseInt(localStorage.getItem('userID')))
      }
    },
    //ERROR ACTIONS
    eraseError({ commit }, key) {
      commit('ERASE_ERROR', key)
    }
  }
})
