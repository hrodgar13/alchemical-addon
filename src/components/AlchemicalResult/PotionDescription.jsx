import {Fragment, useId} from "react";
import Button from "../shared/button/Button.jsx";
import {CheckIcon, CloseIcon, PencilIcon} from "../shared/icons/Icons.jsx";
import {usePotionBrew} from "../../contexts/PotionBrewContext.jsx";
import {parseDescription} from "../../rules/potion-description.js";

import styles from './alchemical-result.module.css'

export default function PotionDescription() {
    const {
        recipeKey,
        potion,
        potionEdit,
        alchemicalSentence,
        ingredientEffects,
        startPotionEdit,
        changePotionEdit,
        confirmPotionEdit,
        cancelPotionEdit,
        toggleScorched
    } = usePotionBrew()
    const tagsHintId = useId()

    if (!recipeKey) {
        return <div className={styles.Description}>
            <p className={styles.Hint}>Оберіть основу та інгредієнт у кожному слоті — тут з'явиться зілля.</p>
        </div>
    }

    const isEditing = potionEdit !== null
    const availableTags = ingredientEffects.map(effect => `%${effect.ingredient.alchemicalWord}%`).join(', ')

    return <div className={styles.Description}>
        <p className={styles.Sentence}>«{alchemicalSentence}»</p>

        <div className={styles.TitleRow}>
            {isEditing
                ? <input
                    className={styles.NameInput}
                    value={potionEdit.name}
                    onChange={event => changePotionEdit({name: event.target.value})}
                    placeholder={alchemicalSentence}
                    aria-label="Назва зілля"
                />
                : <h3 className={styles.Name}>{potion.name || alchemicalSentence}</h3>}

            {isEditing
                ? <>
                    <Button onClick={confirmPotionEdit} aria-label="Підтвердити зміни"><CheckIcon/></Button>
                    <Button onClick={cancelPotionEdit} aria-label="Скасувати зміни"><CloseIcon/></Button>
                </>
                : <>
                    <Button onClick={toggleScorched} aria-pressed={potion.isScorched}>Згар</Button>
                    <Button onClick={startPotionEdit} disabled={potion.isScorched} aria-label="Редагувати назву й опис">
                        <PencilIcon/>
                    </Button>
                </>}
        </div>

        {isEditing && <>
            <textarea
                className={styles.DescriptionInput}
                value={potionEdit.description}
                onChange={event => changePotionEdit({description: event.target.value})}
                placeholder="Що робить зілля? Напр.: Випивши зілля, істота протягом %Сила% завдає…"
                aria-label="Опис зілля"
                aria-describedby={tagsHintId}
                rows={5}
            />
            <p className={styles.Hint} id={tagsHintId}>
                Теги цього зілля: {availableTags} — на їх місці будуть кубики й тривалість з рецепту.
            </p>
        </>}

        {!isEditing && (potion.isScorched
            ? <p className={styles.Scorched}>Згар: алхімічне речення не має сенсу — зілля не вийде.</p>
            : <DescriptionText description={potion.description} ingredientEffects={ingredientEffects}/>)}
    </div>
}

function DescriptionText({description, ingredientEffects}) {
    if (!description) {
        return <p className={styles.Hint}>Нове зілля — опису ще немає. Натисніть олівець, щоб описати його.</p>
    }

    // Частини статичні в межах рендеру, тому індекс як key тут безпечний
    return <p className={styles.Text}>
        {parseDescription(description, ingredientEffects).map((part, index) => part.value
            ? <span key={index} className={styles.Value}>{part.value}</span>
            : <Fragment key={index}>{part.text}</Fragment>
        )}
    </p>
}
