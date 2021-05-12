<template>
  <v-dialog
      v-model="questionDialog"
      width="500"
  >
    <v-card>
      <v-card-title>
        {{ $t('New question') }}
      </v-card-title>

      <v-card-text>
        <div class="input">
          <v-text-field
              :label="$t('Question text')"
              outlined
              v-model="editingQuestion.questionText"
          ></v-text-field>
        </div>

        <div class="input">
          <v-text-field
              :label="$t('Question explanation')"
              outlined
              v-model="editingQuestion.explanation"
          ></v-text-field>
        </div>

        <v-divider></v-divider>
        <br/>
        <div class="subtitle-1"> {{ $t('Answers') }}
          <v-btn
              v-if="!addingQuestionNewAnswer"
              text
              @click="addNewAnswer"
          >{{ $t('Create answer') }}
          </v-btn>
        </div>

        <div class="newAns" v-if="addingQuestionNewAnswer">
          <v-text-field
              :label="$t('New answer')"
              outlined
              v-model="newAnswer"
          ></v-text-field>
          <div>

            <v-layout row wrap>
              <v-flex xs8>
                <v-file-input
                    v-model="files"
                    placeholder="Upload your documents"
                    label="File input"
                    multiple
                    prepend-icon="mdi-paperclip"
                />
              </v-flex>
              <v-flex xs4>
                <v-btn
                    v-if="files && files.length>0"
                    large
                    @click="upload">{{ $t('Upload') }}
                </v-btn>
              </v-flex>
            </v-layout>
            <v-img
                v-if="newAnswerImageUrl"
                lazy-src="https://picsum.photos/id/11/10/6"
                max-height="50"
                :src="newAnswerImageUrl"
            ></v-img>
          </div>
          <v-btn
              color="primary"
              text
              @click="saveNewAnswer"
          >{{ $t('add') }}
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="cancelNewAnswer"
          >{{ $t('cancel') }}
          </v-btn>
        </div>


        <div class="input" v-for="(answer, index) in editingQuestion.answerOptions" :key="answer">
          <v-checkbox
              v-model="editingQuestion.correctAnswers"
              :label="answer"
              :value="index"
          ></v-checkbox>
          <v-img
              v-if="editingQuestion.answerImages && editingQuestion.answerImages[answer]"
              lazy-src="https://picsum.photos/id/11/10/6"
              max-height="80"
              max-width="80"
              :src="editingQuestion.answerImages[answer]"
          ></v-img>
          <span v-if="isCorrectAnwer(index)" class="body-1">{{ $t('(correct)') }}</span>
          <v-btn
              color="primary"
              text
              @click="removeEditingAnswer(answer, index)"
          >{{ $t('remove answer') }}
          </v-btn>
        </div>


      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="questionDialog = false"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
            v-if="action==='create'"
            color="primary"
            text
            @click="createQuestion"
        >
          {{ $t('Save') }}
        </v-btn>
        <v-btn
            v-if="action==='edit'"
            color="primary"
            text
            @click="editQuestion"
        >
          {{ $t('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */
import {Component, Prop, Vue} from 'vue-property-decorator';
import QuizCard from "@/components/CourseCard.vue";
import {Lesson} from "@/models/Lessons";
import moment from "moment";
import {Question} from "@/models/Quiz";
import {uploadFile} from "@/services/filesService";

export default {
  name: "QuestionEditDialog",
  props: {
    value: Boolean,
    existingQuestion: Object,
    index: Number,
    action: String
  },
  data() {
    return {
      editingQuestion: this.initQuestion(),
      newAnswer: "",
      newAnswerImageUrl: "",
      files: [],
      addingQuestionNewAnswer: false
    }
  },
  methods: {
    initQuestion() {
      const existing = this.existingQuestion
      if (existing) {
        if (!existing.answerImages || Array.isArray(existing.answerImages)) {
          existing.answerImages = {}
        }
        console.log(existing)
        return existing
      }
      return {
        questionText: "",
        questionNumber: this.index,
        explanation: "",
        answerOptions: [],
        answerImages: {},
        correctAnswers: []
      }
    },
    createQuestion() {
      this.editingQuestion.questionNumber = this.index
      console.log(this.editingQuestion)
      this.$emit("addQuestion", this.editingQuestion)
      this.questionDialog = false
      this.newAnswer = ""
      this.newAnswerImageUrl = ""
    },
    editQuestion() {
      this.editingQuestion.questionNumber = this.index
      console.log(this.editingQuestion)
      this.$emit("editQuestion", this.editingQuestion)
      this.questionDialog = false
      this.newAnswer = ""
      this.newAnswerImageUrl = ""
      console.log(this.editingQuestion)
    },
    addNewAnswer() {
      this.addingQuestionNewAnswer = true
    },
    isCorrectAnwer(index) {
      return this.editingQuestion.correctAnswers.includes(index)
    },

    saveNewAnswer() {
      this.addingQuestionNewAnswer = false
      this.editingQuestion.answerOptions.push(this.newAnswer)
      if (!this.editingQuestion.answerImages) this.editingQuestion.answerImages = {}
      this.editingQuestion.answerImages[this.newAnswer] = this.newAnswerImageUrl
      this.newAnswer = ""
      this.newAnswerImageUrl = ""
      console.log(this.editingQuestion)
    },
    cancelNewAnswer(){
      this.addingQuestionNewAnswer = false
      this.newAnswer = ""
      this.newAnswerImageUrl = ""
    },
    removeEditingAnswer(answer, index) {
      console.log(this.editingQuestion.answerOptions)
      this.editingQuestion.answerOptions = this.editingQuestion.answerOptions.filter((ans) => ans !== answer)
      this.editingQuestion.answerImages[answer] = null
      this.editingQuestion.correctAnswers = this.editingQuestion.correctAnswers.filter((ans) => ans !== index)
      console.log(this.editingQuestion.answerOptions)

      this.$forceUpdate();
    },
    async upload() {
      const image = await uploadFile(this.files[0])
      this.newAnswerImageUrl = image
      this.$forceUpdate()
    }
  },
  created() {
    if (this.existingQuestion) {
      this.editingQuestion = Object.assign({}, this.existingQuestion)
    } else {
      this.editingQuestion = this.initQuestion()
    }
  },
  watch: {
    existingQuestion: function (newQuestion, oldQuestion) {
      if (!newQuestion) {
        this.editingQuestion = this.initQuestion()
      } else {
        this.editingQuestion = newQuestion
      }
    }
  },
  computed: {
    questionDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style>
.newAns{
  padding: 10px;
  border-style: solid;
  border-width: 2px;
  border-radius: 2px;
  border-color: blue;
}
</style>