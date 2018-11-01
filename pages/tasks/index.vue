<template>
  <v-layout
    row
    wrap>
    <v-flex
      xs12
      sm12
      md12>
      <v-toolbar flat>
        <v-toolbar-title>Tasks</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          to="/tasks/new">New Task</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="taskHeaders"
        :items="tasks"
        :pagination.sync="pagination"
        :total-items="taskTotalCount"
        :loading="taskLoading">
        <template 
          slot="items" 
          slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.description }}</td>
          <td>{{ props.item.done }}</td>
          <td>
            <v-icon
              small
              @click="showTask(props.item)">
              details
            </v-icon>
            <v-icon
              small
              @click="editTask(props.item)">
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteTask(props.item)">
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      taskHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Done', value: 'done' },
        { text: 'Actions', value: 'id', sortable: false }
      ],
      tasks: [],
      taskTotalCount: 0,
      taskLoading: true,
      pagination: {}
    }
  },
  watch: {
    pagination: {
      handler() {
        this.getTasks()
      },
      deep: true
    }
  },
  methods: {
    async getTasks() {
      this.taskLoading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const accessToken = this.$auth.getToken('doorkeeper')
      const params = { page, page, perPage: rowsPerPage }
      if (sortBy) {
        if (!params['q']) {
          params['q'] = {}
        }
        params['q']['s'] = `${sortBy} ${descending ? 'desc' : 'asc'}`
      }

      await this.$store.dispatch('tasks/getTasks', {
        accessToken: accessToken,
        params: params
      })
      this.tasks = this.$store.getters['tasks/tasks']
      const tasksMeta = this.$store.getters['tasks/tasksMeta']
      this.taskTotalCount = tasksMeta.totalCount

      this.taskLoading = false
    },
    showTask(task) {
      this.$router.push(`/tasks/${task.id}`)
    },
    editTask(task) {
      this.$router.push(`/tasks/${task.id}/edit`)
    },
    async deleteTask(task) {
      if (confirm('Are you sure?')) {
        const accessToken = this.$auth.getToken('doorkeeper')
        await this.$store.dispatch('tasks/deleteTask', {
          accessToken: accessToken,
          id: task.id
        })
        if (this.$store.getters['tasks/deleteCompleted']) {
          this.getTasks()
        }
      }
    }
  }
}
</script>
