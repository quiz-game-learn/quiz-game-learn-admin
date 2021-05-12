<template>
  <div v-if="headers">
  <v-data-table
      :headers="headers"
      :items="lessons"
      :items-per-page="15"
      class="elevation-1 table"
  >
    <template v-slot:item.createdAt="{ item }">
        {{ timeSince(item.createdAt) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
    </template>
    <template v-slot:no-data>
    </template>


  </v-data-table>


  </div>
</template>

<script lang="ts">
/* eslint-disable */
import {Component, Prop, Vue} from 'vue-property-decorator';
import QuizCard from "@/components/CourseCard.vue";
import {Lesson} from "@/models/Lessons";
import moment from "moment";

@Component({
  components: {QuizCard: QuizCard},
})
export default class LessonsTable extends Vue {
  @Prop({required: false, type: Array, default: []}) readonly lessons: Lesson[]

  private headers= [
    {
      text: this.$t('Title'),
      align: 'start',
      sortable: false,
      value: 'title',
    },
    { text: this.$t('Subtitle'), value: 'subtitle' },
    { text: this.$t('Index'), value: 'index' },
    { text: this.$t('Created'), value: 'createdAt' },
    { text: 'Id', value: 'id' },
    { text: this.$t('Actions'), value:'actions'},

  ]
  async created() {
  }

  public editItem(value:any) {
    this.$router.push({ name: 'LessonEdit', params: { action:"edit", id: value.id, courseId: value.courseId || "None" } })
    console.log(value.id)
  }

  public timeSince(date:Date) {
    moment(date).fromNow()
  }

}
</script>

<style>
.main-title{
  margin-top: 20px;
  text-align: center;
}
.table{
  margin: 20px;
}
</style>