import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomID = params.id;
    const { title, questions } = useRoom(roomID);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomID}`).update({
            endedAt: new Date(),
        });
        history.push('/');
    }
    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que deseja remover esta pergunta?")) {
            await database.ref(`rooms/${roomID}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswerd(questionId: string) {
        await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
            isAnswerd: true,
        });
    }

    async function handleHightLigthQuestion(questionId: string) {
        await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
            isHigthlited: true,
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Let Me Ask" />
                    <div>
                        <RoomCode code={roomID} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswerd}
                                isHigthlited={question.isHigthlited}

                            >
                                {!question.isAnswerd && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswerd(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar como resolvida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHightLigthQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque" />
                                        </button>   
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>

            </main>
        </div>
    )
}