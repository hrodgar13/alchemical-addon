import {useReducer} from "react"
import {FIELD_INSTRUMENTS, INGREDIENT_RARITIES, MAX_UNGRIND, STATION} from "../../static/static.js"
import difficultyCalculator from "../../rules/difficulty-calculator.js"
import PotionValidation from "../../rules/potion-validation.js"
import {calculateIngredientEffects} from "../../rules/ingredient-effects.js"
import {buildAlchemicalSentence, findBrewedPotion, getRecipeKey} from "../../rules/brewed-potion.js"
import {toEditableDescription, toStoredDescription} from "../../rules/potion-description.js"
import {usePotionComponents} from "../../hooks/usePotionComponents.js"
import {PotionBrewContext} from "./potion-brew-context.js"

const ACTION_BASE_CHANGED = "base/changed"
const ACTION_WHERE_WE_COOK_CHANGED = "whereWeCook/changed"
const ACTION_DISTILL_CHANGED = "distill/changed"
const ACTION_ADD_NEW_INGREDIENT = "ingredient/add"
const ACTION_EDIT_EXISTING_INGREDIENT = "ingredient/edit"
const ACTION_REMOVE_INGREDIENT = "ingredient/remove"
const ACTION_POTION_DRAFT_CHANGED = "potionDraft/changed"
const ACTION_POTION_EDIT_STARTED = "potionEdit/started"
const ACTION_POTION_EDIT_CHANGED = "potionEdit/changed"
const ACTION_POTION_EDIT_CONFIRMED = "potionEdit/confirmed"
const ACTION_POTION_EDIT_CANCELLED = "potionEdit/cancelled"
const ACTION_RESET = "reset"

const initialState = {
    whereWeCook: FIELD_INSTRUMENTS,
    // Лише id: саму основу беремо з каталогу під час рендеру, тож її редагування одразу видно в рецепті
    baseId: null,
    // Слоти рецепту: {ingredientCombinationId, ingredientId, rarity, ground}. Як і з основою — лише id
    ingredients: [],
    distill: false,
    // Підтверджені, але ще не збережені на сервері зміни зілля (назва, опис, згар)
    potionDraft: null,
    // Незавершене редагування назви й опису — до натискання «підтвердити»
    potionEdit: null,
}

const EMPTY_POTION = {name: "", description: "", isScorched: false}

function reducer(state, action) {
    switch (action.type) {
        case ACTION_WHERE_WE_COOK_CHANGED:
            return {
                ...state,
                whereWeCook: action.payload,
                distill: action.payload === FIELD_INSTRUMENTS ? false : state.distill,
            }
        case ACTION_BASE_CHANGED:
            return {...state, baseId: action.payload}
        case ACTION_DISTILL_CHANGED:
            return {...state, distill: action.payload}
        case ACTION_ADD_NEW_INGREDIENT:
            return {...state, ingredients: [...state.ingredients, action.payload]}
        // Фігурні дужки дають case власну область видимості для const
        case ACTION_EDIT_EXISTING_INGREDIENT: {
            const updatedIngredientList = state.ingredients.map(ingredient => {
                if (ingredient.ingredientCombinationId === action.payload.ingredientCombinationId) {
                    return {...action.payload}
                }

                return ingredient
            })

            return {...state, ingredients: updatedIngredientList}
        }
        case ACTION_REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter(
                    ingredient => ingredient.ingredientCombinationId !== action.payload,
                ),
            }

        case ACTION_POTION_DRAFT_CHANGED:
            return {...state, potionDraft: action.payload}
        case ACTION_POTION_EDIT_STARTED:
            return {...state, potionEdit: action.payload}
        case ACTION_POTION_EDIT_CHANGED:
            return {...state, potionEdit: {...state.potionEdit, ...action.payload}}
        case ACTION_POTION_EDIT_CONFIRMED:
            return {...state, potionDraft: action.payload, potionEdit: null}
        case ACTION_POTION_EDIT_CANCELLED:
            return {...state, potionEdit: null}

        // Після варки — чиста форма, але місце варки лишається тим самим
        case ACTION_RESET:
            return {...initialState, whereWeCook: state.whereWeCook}

        default:
            throw new Error("Unknown action type in potion context reducer")
    }
}

function PotionBrewProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {whereWeCook, baseId, distill} = state
    const {bases, ingredients: catalogIngredients, brewedPotions, saveBrewedPotion} = usePotionComponents()

    const base = bases.find(base => base.id === baseId) ?? null
    // Назовні слот віддаємо з повним інгредієнтом із каталогу — споживачі не знають про id
    const ingredients = state.ingredients.map(({ingredientId, ...slot}) => ({
        ...slot,
        ingredient: catalogIngredients.find(ingredient => ingredient.id === ingredientId) ?? null,
    }))

    const difficulty = difficultyCalculator(whereWeCook, base, ingredients, distill)
    const message = PotionValidation(difficulty, whereWeCook, base, ingredients)
    const ingredientEffects = calculateIngredientEffects({ingredients, distill})

    // Зілля поточного рецепту — похідні значення, рахуються під час рендеру
    const recipeKey = getRecipeKey({base, ingredients})
    const brewedPotion = findBrewedPotion({recipeKey, brewedPotions})
    const alchemicalSentence = buildAlchemicalSentence({base, ingredientEffects})

    // Чернетка й редагування прив'язані до ключа рецепту: змінився набір інгредієнтів —
    // показуємо інше зілля без жодного useEffect. Повернувся назад — чернетка знову на місці
    const potionDraft = state.potionDraft?.recipeKey === recipeKey ? state.potionDraft : null
    const potionEdit = state.potionEdit?.recipeKey === recipeKey ? state.potionEdit : null
    const potion = potionDraft ?? brewedPotion ?? EMPTY_POTION

    const canBrew = recipeKey !== null && !message && !potionEdit

    function setWhereWeCook(newWhereWeCook) {
        if (whereWeCook === newWhereWeCook) return

        dispatch({type: ACTION_WHERE_WE_COOK_CHANGED, payload: newWhereWeCook})
    }

    function setBase(newBase) {
        const newBaseId = newBase?.id ?? null
        if (baseId === newBaseId) return

        dispatch({type: ACTION_BASE_CHANGED, payload: newBaseId})
    }

    function setDistill(newDistillValue) {
        if (newDistillValue === distill || whereWeCook !== STATION) return

        dispatch({type: ACTION_DISTILL_CHANGED, payload: newDistillValue})
    }

    function addNewIngredient() {
        // Унікальний id, що не повторюється після видалень (на відміну від length + 1)
        const newIngredientCombinationId = crypto.randomUUID()

        // 4-й інгредієнт можливий лише коли перетерті всі — тому він створюється одразу перетертим
        const isExtraIngredient = ingredients.length === MAX_UNGRIND

        const newIngredient = {
            ingredientCombinationId: newIngredientCombinationId,
            ingredientId: null,
            rarity: INGREDIENT_RARITIES[0],
            ground: isExtraIngredient,
        }

        dispatch({type: ACTION_ADD_NEW_INGREDIENT, payload: newIngredient})
    }

    // Приходить слот з об'єктом інгредієнта (як його віддали назовні) — у стан кладемо лише id
    function editIngredientCombination({ingredient, ...slot}) {
        dispatch({type: ACTION_EDIT_EXISTING_INGREDIENT, payload: {...slot, ingredientId: ingredient?.id ?? null}})
    }

    function removeIngredient(ingredientCombinationId) {
        dispatch({type: ACTION_REMOVE_INGREDIENT, payload: ingredientCombinationId})
    }

    function startPotionEdit() {
        dispatch({
            type: ACTION_POTION_EDIT_STARTED,
            payload: {
                recipeKey,
                name: potion.name,
                description: toEditableDescription(potion.description, ingredientEffects),
            },
        })
    }

    function changePotionEdit(changes) {
        dispatch({type: ACTION_POTION_EDIT_CHANGED, payload: changes})
    }

    function confirmPotionEdit() {
        dispatch({
            type: ACTION_POTION_EDIT_CONFIRMED,
            payload: {
                ...potion,
                recipeKey,
                name: potionEdit.name.trim(),
                description: toStoredDescription(potionEdit.description.trim(), ingredientEffects),
            },
        })
    }

    function cancelPotionEdit() {
        dispatch({type: ACTION_POTION_EDIT_CANCELLED})
    }

    function toggleScorched() {
        dispatch({type: ACTION_POTION_DRAFT_CHANGED, payload: {...potion, recipeKey, isScorched: !potion.isScorched}})
    }

    // На сервер зміни йдуть лише тут — нове зілля додається, відоме оновлюється
    async function brewPotion() {
        if (!canBrew) return

        await saveBrewedPotion({
            id: brewedPotion?.id ?? null,
            name: potion.name || alchemicalSentence,
            description: potion.description,
            isScorched: potion.isScorched,
            baseId: base.id,
            ingredientsIds: ingredientEffects.map(effect => effect.ingredient.id),
        })

        dispatch({type: ACTION_RESET})
    }

    return (
        <PotionBrewContext.Provider
            value={{
                whereWeCook,
                base,
                ingredients,
                distill,
                difficulty,
                message,
                ingredientEffects,
                recipeKey,
                potion,
                potionEdit,
                alchemicalSentence,
                canBrew,
                setWhereWeCook,
                setBase,
                setDistill,
                addNewIngredient,
                editIngredientCombination,
                removeIngredient,
                startPotionEdit,
                changePotionEdit,
                confirmPotionEdit,
                cancelPotionEdit,
                toggleScorched,
                brewPotion,
            }}
        >
            {children}
        </PotionBrewContext.Provider>
    )
}

export {PotionBrewProvider}
