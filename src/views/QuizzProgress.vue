<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400">
        <v-img
            height="200px"
            src="https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png"
        >
          <v-app-bar
              flat
              color="rgba(0, 0, 0, 0)"
          >
            <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

            <v-toolbar-title class="title white--text pl-0">
              {{ quizz.title }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                color="white"
                icon
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>

          <v-card-title class="white--text mt-8">
            <p class="ml-3">
              {{ quizz.subtitle }}
            </p>
          </v-card-title>
        </v-img>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2">
            Progress
          </div>

          <v-timeline
              align-top
              dense
          >
            <v-timeline-item
                small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>Initial test:</strong> see how much you already know
                </div>
                <div></div>
              </div>
            </v-timeline-item>

            <v-timeline-item
                small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>Explanation:</strong> see how it is done
                </div>
                <div></div>
              </div>
            </v-timeline-item>

            <v-timeline-item
                small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>test:</strong> see how much you picked up
                </div>
                <div></div>
              </div>
            </v-timeline-item>

            <v-timeline-item
                small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>results:</strong> how did you do
                </div>
                <div></div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        <v-card-actions>
          <v-btn
              text
              color="teal accent-4"
              v-on:click="startQuizz()"
          >
            Go for it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Quiz} from "../models/Quiz";
import QuizCard from "@/components/CourseCard.vue";

@Component({
  components: {QuizCard: QuizCard},
})
export default class QuizzProgress extends Vue {
  public quizz: Quiz | undefined

  public startQuizz = () => {
    this.$router.push('quizz-start')

  }
  async created() {
    this.quizz = this.$store.state.selectedQuiz
  }
}
</script>
