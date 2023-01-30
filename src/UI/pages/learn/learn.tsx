import React, { useEffect, useState } from "react";
import { SuperButton, SuperRadio } from "../../common";
import s from "./learn.module.css";
import { CardType } from "../../../dal/cardsAPI";
import { useAppDispatch, useAppSelector } from "bll/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCardsPageTC, putAGradeTC } from "bll/reducers/cards-reducer";

import back from "assets/icon/back.svg";
import { PATH } from "bll/Path";

const getCard = (cards: CardType[]) => {
  const sum = cards.reduce((acc, card) => acc + (6 - card.grade) * (6 - card.grade), 0);
  const rand = Math.random() * sum;
  const res = cards.reduce(
    (acc: { sum: number; id: number }, card, i) => {
      const newSum = acc.sum + (6 - card.grade) * (6 - card.grade);
      return { sum: newSum, id: newSum < rand ? i : acc.id };
    },
    { sum: 0, id: -1 }
  );
  console.log("test: ", sum, rand, res);

  return cards[res.id + 1];
};

export const Learn = () => {
  const [visibleAnswer, setVisibleAnswer] = useState<boolean>(false);
  const grades = ["не знал", "забыл", "долго думал", "перепутал", "знал"];
  const [valueRadio, onChangeOption] = useState(grades[0]);
  const [grade, setGrade] = useState<number>(1);
  const { cards } = useAppSelector((state) => state.cards);
  const cardsPack = useAppSelector((state) => state.cards);
  const [first, setFirst] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const cardsPack_id = params.cardsPack_id;
  const [card, setCard] = useState<CardType>({} as CardType);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (first) {
      dispatch(getCardsPageTC({ ...params, cardsPack_id })); // тут ошибка
      setFirst(false);
    }
    if (cards.length > 0) setCard(getCard(cards));
  }, [dispatch, params.id, cards, first]);
  const onNext = () => {
    setVisibleAnswer(false);

    if (cards.length > 0) {
      dispatch(putAGradeTC(grade, card._id));
      setCard(getCard(cards));
    } else {
      console.log("В колоде нету карточек");
    }
  };

  const onChangeGrade = (value: string) => {
    switch (value) {
      case "не знал": {
        setGrade(1);
        onChangeOption(value);
        break;
      }
      case "забыл": {
        setGrade(2);
        onChangeOption(value);
        break;
      }
      case "долго думал": {
        setGrade(3);
        onChangeOption(value);
        break;
      }
      case "перепутал": {
        setGrade(4);
        onChangeOption(value);
        break;
      }
      case "знал": {
        setGrade(5);
        onChangeOption(value);
        break;
      }
      default:
        setGrade(0);
    }
  };

  const onVisibleHandler = () => {
    setVisibleAnswer(!visibleAnswer);
  };

  const BackToPackList = () => {
    navigate(PATH.PACK_PAGE);
  };

  return (
    <div>
      <div className={s.backBlock} onClick={BackToPackList}>
        <img src={back} alt="back" />
        <span>Back to Packs List</span>
      </div>
      <div className={s.learnPageContainer}>
        <div className={s.learnContainer}>
          <div className={s.namePack}>{cardsPack.packName}</div>
          <div className={s.questionContainer}>
            <div className={s.question}>Question: {card.question}</div>
            <div className={s.rating}>Количество попыток ответить на этот вопрос: {card.shots}</div>

            {visibleAnswer ? (
              <div className={s.answerContainer}>
                Answer: {card.answer}
                <div className={s.valueAnswer}>
                  <div className={s.variantAnswer}> Варианты ответа:</div>
                  <SuperRadio options={grades} value={valueRadio} onChangeOption={onChangeGrade} />
                </div>
                <div className={s.nextButton}>
                  <SuperButton className={s.buttonStyle} onClick={onNext}>
                    Следующий вопрос
                  </SuperButton>
                </div>
              </div>
            ) : (
              <div className={s.showAnswer}>
                <SuperButton className={s.buttonStyle} onClick={onVisibleHandler}>
                  Показать ответ
                </SuperButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
