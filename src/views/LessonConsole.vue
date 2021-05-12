<template>
  <div>
    <h1 v-if="!course.title" class="heading main-title">{{ $t("Lessons") }}</h1>
    <h1 v-if="course.title" class="main-title heading">{{ $t("Lessons") }} in {{ course.title }}</h1>
    <v-btn
        large
        class="lessonbtn"
        :loading="!lessons"
        @click="newLesson">{{ $t('New lesson') }}
    </v-btn>
    <LessonsTable v-if="lessons" :lessons="lessons"></LessonsTable>
  </div>

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import LessonsTable from "@/components/LessonsTable.vue";
import {Course} from "@/models/Course";
import {getCourse} from "@/services/dbService";
import {Lesson} from "@/models/Lessons";

@Component({
  components: {LessonsTable: LessonsTable},
})
export default class LessonConsole extends Vue {
  public dialog = false
  public courseId: string
  public course: Course = {} as Course

  get lessons() {
    console.log(this.$store.state.lessons)
    return this.sortLesson(this.$store.state.lessons as Lesson[])
  }

  sortLesson(lessons: Lesson[]) {
    return lessons.sort((lesson1, lesson2) => {
      if (!lesson1.index && lesson2.index) return -1
      if (lesson1.index && !lesson2.index) return 1
      return lesson1.index - lesson2.index
    })
  }

  newLesson() {
    this.$router.push({name: 'LessonEdit', params: {courseId: this.courseId, id: "None", action: "create"}})
  }

  async created() {
    this.courseId = this.$route.params.courseId

    if (this.courseId && this.courseId !== "" && this.courseId !== "None") {
      await this.$store.dispatch('setLessonsInCourse', this.courseId)
      this.course = await getCourse(this.courseId) as Course
    } else {
      await this.$store.dispatch('setLessons')
    }
    this.$forceUpdate()

  }

}
</script>
<style>
.lessonbtn {
  margin: 30px
}
</style>
