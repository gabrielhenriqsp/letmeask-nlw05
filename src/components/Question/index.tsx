import './style.scss';
import cx from 'classnames';
import { ReactNode } from 'react'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHigthlited?: boolean;

}

export function Question({ content, author, children, isAnswered = false, isHigthlited = false }: QuestionProps) {
    return (
        <div
            className={cx(
                'question',
                { answered: isAnswered },
                { hightlighted: isHigthlited && !isAnswered}
            )}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div >
    );
}