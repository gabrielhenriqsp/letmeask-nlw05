import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswerd: boolean;
    isHigthlited: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswerd: boolean;
    isHigthlited: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomID: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomID}`);
        roomRef.on('value', room => {

            const databaseRoom = room.val();
            const fireBaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHigthlited: value.isHigthlited,
                    isAnswerd: value.isAnswerd,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(
                        ([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
        return () => {
            roomRef.off('value');
        }
    }, [roomID, user?.id]);

    return { questions, title }
}