import { Component } from 'react';

import './charList.scss';
import Spinner from '../Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
    constructor (props) {
        super(props)
        this.state = { // Создали начальное состояние елементов
            chars: [], // На обьект мы не можем создать метод map поэтому создаём массив
            error: false,
            loading: true, // Нужен здесь только для того чтобы создать изначальный спин перед загрузкой всех карточек
            newItemLoading: false,
            offset: 210,
            activeCharId: null,
            scroll: false,
            charEnded: false
        }
    }

    marvelService = new MarvelService(); // Используем экземпляр класса

    
    // Хуки для монтирования
    componentDidMount = () => { // Создали хук для монтирования состояния метода, то-есть чтобы создать правильную последовательность работы setState в updateAllChar
        this.onRequestAndUpdateAllChar();
        window.addEventListener('scroll', this.handleScroll)
        console.log('Компонент рендерится')
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll)
    }


    // Методы для пагинации данных
    onRequestAndUpdateAllChar = (offset) => { // Метод отправляет запрос и обновляет данные персонажей
        this.onCharListLoading(); // Переводит стейт в true изменяя начальный стейт с false на true
        this.marvelService // Используем экземпляр класса и его методы
        .getItemCharacter(offset) // Этот метод возвращает промис, который асинхронно получает данные персонажей с API.
        .then(this.newCharList) // Так как достаем метод который является промисом, можем использовать then catch, если промис разрешается данные передаются в newCharList
        .catch(this.onError); // Используем catch и применяем к нему наш метод с ошибкой

        // ! Метод обновляет стейт и работает с экземпляром класса получая из его методов API(данные которые мы передаём в newCharList) и помещаем в newCharList где он обновляет его состояние
    }
    
    onCharListLoading = () => { // Метод изменяет стейт для загрузки новых персонажей
        this.setState({
            newItemLoading: true, // Переводит стейт в true изменяя начальный стейт с false на true
        })
    }

    newCharList = (newChar) => { // Метод который создаёт новых персонажей и изменяет стейт для offset и chars

        let ended = false;
        if (newChar.length  < 9) { // Здесь мы проверяем что если длинна массива который нам приходит меньше 9, то меняем сейт charEnder в true
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChar], // Обновляем массив персонажей, добавляя новые к существующим
            loading: false, // Отключаем индикатор загрузки
            newItemLoading: false, // Убираем состояние загрузки новых элементов
            offset: offset + 9, // Увеличиваем offset на 9, чтобы загружать следующие 9 персонажей в будущем запросе
            scroll: true, // Устанавливаем флаг, что прокрутка активна
            charEnded: ended // Обновляем состояние окончания персонажей, если они закончились
        }))

        // ! Метод создаёт новый массив добавляя к старым данным, новые, мы проверяем что если приходит меньше 9 елементов то остонавливаем обновление, переключая стейт charEnded в true, далее мы изменяем текущий стейт, создаём в chars в массиве старые данные, и записываем новые, отключаем загрузку и так же добавляем к offset + 9 записываю offset как аргумент, устонавливаем scroll в true для обновления персонажей в конце страницы, и устонавливаем динамически меняющийся charEnded
    }    


    // Доп. методы
    onError = () => { // Метод который вызовет ошибку и поменяет error в true а loading в false
        this.setState({
            error: true, 
            loading: false
        })
    }

    handleScroll = () => { // Метод который позволяет получить конечную высоту прокрутки overflow
        const {clientHeight, scrollHeight, scrollTop} = document.documentElement;
        const {scroll, charEnded, offset} = this.state;

        if (scrollTop + clientHeight >= scrollHeight && (scroll && !charEnded)) {
            console.log('Произошла конечная прокрутка')
            this.onCharListLoading();
            this.onRequestAndUpdateAllChar(offset);
        }
    }

    itemCharState = (id) => { // Метод устонавливает в стейт activeCharId новый id
        this.setState({
            activeCharId: id // Если мы получаем айди в стейт activeCharId то он будет равен тому 
        })
        console.log(id)
    }

    render () {

        const {chars, loading, error, offset, newItemLoading, charEnded, activeCharId} = this.state; // Вытащили chars как пропс-состояние
        const {onCharSelected} = this.props; // Передали как пропс для использования в функции renderChar
        console.log(chars)
        console.log(offset)
        console.log(charEnded)

        const items = renderChar(chars, onCharSelected, activeCharId, this.itemCharState);
        console.log(items)

        const loadChar = loading ? <Spinner></Spinner> : null;
        const errorItem = error ? <ErrorMessage></ErrorMessage> : null;
        // Показать спиннеры для всех карточек при загрузке
        const content = !(loading || error) ? items : null;
        
        return (
            <div className="char__list">
                    {loadChar}
                    {errorItem}
                    {content}
                <button disabled={newItemLoading} style={{'display': charEnded ? 'none' : 'block'}} onClick={() => this.onRequestAndUpdateAllChar(offset)} className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const renderChar = (arr, onCharSelected, activeCharId, itemCharState) => { // Переделали в функцию добавили в аргументы второй аргумент onCharSelected из App получили мы его с помощью записи в this.props как пропс 
    const items = arr.map((item) => {
        const imgStyle = {
            objectFit: 'fill',
        }

        let boxStyle = {
            boxShadow: '0px 5px 20px 0px rgb(159, 0, 19)',
            transition: '0.5s all'
        }

        const textStyle = {
            fontSize: '18px'
        }
    
        if (!arr) {
            return null; // Если char undefined, не рендерим ничего
        }

        return (
            <li style={activeCharId === item.id ? boxStyle : null} 
            onClick={() => {
                onCharSelected(item.id); 
                itemCharState(item.id);
                console.log(activeCharId)
            }} 
            className="char__item" key={item.id}> 
                <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                <div style={textStyle} className="char__name">{item.name}</div>
            </li>
        )
    });

    return ( // Поместили всё так чтобы char__grid остался оболочкой для правильности стилей
        <ul className="char__grid">
            {items}
        </ul>
    )
}

export default CharList;