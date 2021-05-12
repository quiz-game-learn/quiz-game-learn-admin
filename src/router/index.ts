import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import CoursesMenu from '../views/CoursesMenu.vue'
import QuizzProgress from "@/views/QuizzProgress.vue";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import LessonConsole from "@/views/LessonConsole.vue";
import LessonEdit from "@/views/LessonEdit.vue";
import QuizEdit from "@/views/QuizEdit.vue";
import PartEdit from "@/views/PartEdit.vue";
import store from "../store"
import {getCurrentUserFirebase} from "@/firebase";
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Console',
    component: CoursesMenu,
    meta: { requiresLogin: true }
  },
  {
    path: '/quizz-progress',
    name: 'QuizzProgress',
    component: QuizzProgress,
    meta: { requiresLogin: true }
  },
  {
    path: '/lesson_console/:courseId',
    name: 'LessonConsole',
    component: LessonConsole,
    meta: { requiresLogin: true }
  },
  {
    path: '/lesson/:action/:courseId/:id',
    name: 'LessonEdit',
    component: LessonEdit,
    meta: { requiresLogin: true }
  },
  {
    path: '/quiz/edit/:quizType/:lessonId/:id',
    name: 'QuizEdit',
    component: QuizEdit,
    meta: { requiresLogin: true }
  },
  {
    path: '/part/edit/:action/:lessonId/:partNumber/:id',
    name: 'PartEdit',
    component: PartEdit,
    meta: { requiresLogin: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresLogin: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresLogin: false }
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresLogin: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresLogin);
  const user = await getCurrentUserFirebase()
  if (requiresAuth && !user){
    next('Login');
  }else{
    next();
  }
});


export default router
