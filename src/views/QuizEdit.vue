<template>
  <div>
    <h1 class="title font-weight-light main-title">{{ $t("Edit quiz for lesson") }}</h1>
    <h2 v-if="lesson" class="title font-weight-light main-title">{{ lesson.title }}</h2>
    <v-btn
        large
        class="cancel"
        @click="cancel">{{ $t('Cancel') }}
    </v-btn>
    <v-btn
        large
        class="save"
        :loading="!quiz ||! lesson"
        @click="save">{{ $t('Save') }}
    </v-btn>
    <v-btn
        largedificultyPercent
        class="save"
        :loading="!quiz ||! lesson"
        @click="clickDelete">{{ $t('Delete') }}
    </v-btn>
    <v-card
        outlined
        shaped
        tile
        class="general"
    >
      <v-card-title>{{ $t('General') }}</v-card-title>

      <div class="input">
        <v-layout row wrap>
          <v-flex xs8>
            <v-text-field
                :label="$t('Quiz title')"
                outlined
                v-model="title"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-slider
                class="slider"
                v-model="difficultyPercent"
                :label="$t('Quiz difficulty') + ' ' + difficultyPercent"
                thumb-label="always"
            ></v-slider>
          </v-flex>
        </v-layout>
      </div>


      <div class="input">
        <v-text-field
            :label="$t('Description')"
            outlined
            v-model="description"
        ></v-text-field>
      </div>

    </v-card>
    <DeleteDialog v-model="dialogDelete" @deleteAction="deleteQuiz"></DeleteDialog>
    <QuestionEditDialog :action="questionAction"
                        :existingQuestion="editingQuestion"
                        :index="questionIndex"
                        v-model="questionDialog"
                        @editQuestion="editQuestion"
                        @addQuestion="createQuestion"/>


    <div>
      <v-btn
          color="primary"
          text
          @click="clickQuestionCreate"
      >
        {{ $t('Create question') }}
      </v-btn>

      <v-card v-for="(question, index) in questions" :key="question.questionText"
              shaped
              tile
              class="general"
      >
        <v-card-title>{{ $t("Question") }} {{ index + 1 }}</v-card-title>
        <v-btn
            color="primary"
            text
            @click="editQuestionClick(question,index)"
        >
          {{ $t('Edit question') }}
        </v-btn>

        <v-card-text class="question-content">
          <div class="question-text">
            <span class="text-body-1">{{ question.questionText }}</span>
          </div>

          <div class="question-anwers" v-for="(answer, index) in question.answerOptions" :key="answer">
            <span class="text-body-1"><strong>({{ index + 1 }})</strong> </span>
            <span>
              <v-img
                  v-if="question.answerImages && question.answerImages[answer]"
                  lazy-src="https://picsum.photos/id/11/10/6"
                  max-height="50"
                  max-width="50"
                  :src="question.answerImages[answer]"
              ></v-img>
            </span>
            <span class="body-2 answer-text">{{ answer }}</span>
            <span class="correct" v-if="isAnswerCorrect(question,index)">{{ $t("(correct)") }}</span>
          </div>
        </v-card-text>
      </v-card>

    </div>


  </div>

</template>

<script lang="ts">
/* eslint-disable */
import {Component, Vue, Watch} from 'vue-property-decorator';
import {deleteQuiz, getLesson, getQuiz, saveLesson, saveQuiz} from "@/services/dbService";
import {Question, Quiz, QuizType} from "@/models/Quiz";
import {Lesson} from "@/models/Lessons";
import {v4 as uuidv4} from "uuid";
import QuestionEditDialog from "@/components/QuestionEditDialog.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";

@Component({components: {DeleteDialog, QuestionEditDialog}})
export default class QuizEdit extends Vue {

  private quiz: Quiz | null
  private questions: Question[] | null
  private id: string | null
  private type: string | null
  private lessonId: string | null
  private lesson: Lesson | null
  private title: string = this.$i18n.tc('Title')
  private description: string = this.$i18n.tc('Description')
  private difficultyPercent = 50
  private dialogDelete = false
  private questionDialog = false
  private questionAction = "create"
  private questionIndex = 0
  private editingQuestion: Question | null

  async created() {
    this.id = this.$route.params.id
    this.lessonId = this.$route.params.lessonId
    this.type = this.$route.params.quizType
    if (this.id && this.id !== "None") {
      try {
        this.quiz = await getQuiz(this.id)
        if (this.quiz?.questions) {
          this.questions = this.quiz.questions
        } else {
          this.questions = []
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      this.id = uuidv4()
    }

    if (this.lessonId) {
      try {
        this.lesson = await getLesson(this.lessonId)
      } catch (e) {
        console.log(e)
      }
    }

    this.initQuiz()

  }

  public initQuiz() {
    if (!this.quiz) {
      this.quiz = {} as Quiz
      this.quiz.type = this.type as string
      this.questions = []
    }

    if (this.quiz?.difficultyPercent) {
      this.difficultyPercent = this.quiz?.difficultyPercent as number
    }

    if (this.quiz?.description) {
      this.description = this.quiz?.description as string
    }

    if (this.quiz?.title) {
      this.title = this.quiz?.title as string
    }

    this.$forceUpdate();
  }

  isAnswerCorrect(question: Question, answer: number) {
    return question.correctAnswers.includes(answer)
  }

  async clickDelete() {
    this.dialogDelete = true
  }

  clickQuestionCreate() {
    console.log("*******************")
    this.questionDialog = true;
    this.questionAction = 'create';
    this.questionIndex = 0;
    this.editingQuestion = null
    console.log(this.editingQuestion)
    this.$forceUpdate()
  }

  editQuestionClick(question: Question, index: number) {
    console.log("*******************")
    this.questionDialog = true;
    this.questionAction = 'edit';
    this.questionIndex = index;
    this.editingQuestion = question
    console.log(this.editingQuestion)
    this.$forceUpdate()
  }

  async deleteQuiz() {
    this.dialogDelete = false

    if (this.quiz?.type == QuizType.INITIAL) {
      (this.lesson as any).initialQuiz = null
    } else {
      (this.lesson as any).finalQuiz = null
    }
    await saveLesson(this.lesson as Lesson)
    await deleteQuiz(this.quiz as Quiz)

    this.$router.push({
      name: 'LessonEdit',
      params: {action: "edit", courseId: (this.lesson as Lesson).courseId, id: this.lessonId as string}
    })

  }

  updateQuizObject() {
    this.quiz = {
      type: this.type,
      id: this.id,
      title: this.title,
      lessonId: this.lessonId,
      description: this.description,
      difficultyPercent: this.difficultyPercent
    } as Quiz
    this.quiz.questions = this.questions as Question[]

    console.log(this.quiz)
  }

  async createQuestion(createdQuestion: Question) {
    this.questions = this.questions as Question[]
    this.questions.push(createdQuestion)
    await this.saveOrUpdateEdition()
    this.$forceUpdate();
  }

  async editQuestion(createdQuestion: Question) {
    this.questions = this.questions as Question[]
    const index = createdQuestion.questionNumber
    this.questions[index] = createdQuestion
    await this.saveOrUpdateEdition()
    this.$forceUpdate();

  }

  isCorrectEditingAnswer(question: Question, index: number) {
    return question.correctAnswers.includes(index)
  }

  async saveOrUpdateEdition() {
    this.updateQuizObject()
    const result = await saveQuiz(this.quiz as Quiz)
    if (this.lesson && this.type == QuizType.INITIAL) {
      this.lesson.initialQuiz = this.quiz as Quiz
    } else if (this.lesson && this.type == QuizType.FINAL) {
      this.lesson.finalQuiz = this.quiz as Quiz
    }
    await saveLesson(this.lesson as Lesson)
  }

  async save() {
    await this.saveOrUpdateEdition()
    this.$router.push({
      name: 'LessonEdit',
      params: {action: "edit", courseId: (this.lesson as Lesson).courseId, id: this.lessonId as string}
    })

  }

  async cancel() {
    this.$router.push({
      name: 'LessonEdit',
      params: {action: "edit", courseId: (this.lesson as Lesson).courseId, id: this.lessonId as string}
    })
  }
}


</script>

<style>
.main-title {
  margin-top: 20px;
  text-align: center;
}

.general {
  margin: 20px;
}

.input {
  margin: 10px;
}

.save {
  margin-left: 20px;
}

.cancel {
  margin-left: 20px;
}

.correct {
  margin-left: 10px;
}

.answer-text {
  margin-left: 10px;
}

.question-anwers {
  margin-left: 10px;
  margin-top: 10px;
}

.question-content {
  margin: 10px
}

</style>
