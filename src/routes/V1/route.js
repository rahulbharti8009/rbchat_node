import express from 'express'
import { login, users } from '../../controller/auth.controller.js';
import { invite_list, chat_list, inviteUser, acceptUser, rejectUser, saveChatMesg, chatHistory } from '../../controller/dashboard.controller.js';

export const router = express.Router(); 

router.post('/login',login)
router.post('/users',users)
router.post('/chat_list',chat_list)
router.post('/invite_list',invite_list)
router.post('/invite_user',inviteUser)
router.post('/accept_user',acceptUser)
router.post('/reject_user',rejectUser)
router.post('/save_chat_msg',saveChatMesg)
router.post('/chat/history',chatHistory)







