import { Component } from 'react';

import './randomChar.scss';     
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import Spinner from '../Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class RandomChar extends Component {
    state = { // Создали начальное состояния чтобы работать с ним
        char: {},
        loading: true,
        error: false
    };

    marvelService = new MarvelService(); // Является экземпляром класса MarvelService, который используется для взаимодействия с API Marvel. Он предоставляет методы для получения данных о персонажах и другой информации через сетевые запросы.

    onCharLoaded = (char) => { // Метод позволяет загружать характеристику и переводит загрузку в false
        this.setState({char, loading: false}) // Если будет true то загрузка будет вечная
        /* console.log(char) */

        // Если описание пустое, задаем значение по умолчанию
        if (char.description.length === 0) {
            char.description = `Нет описания для данного персонажа`;
        } else if (char.description.length > 210) {
            // Обрезаем описание и добавляем троеточие, если длина больше 180
            char.description = char.description.slice(0, 210) + '...';
        }
        console.log('Загрузка')
    }

    onError = () => { // Метод который изменит состояния и поставит загрузку в false, а ошибку в true
        this.setState({
            loading: false,
            error: true
        })
    }

    componentDidMount() { // Создали компонент в который поместили смонтированный state для loading в компонент updateChar, мы пишем скобки для того иметь доступ к состоянию компонента, без этого хука мы не сможем обновлять персонажа и у нас будет вечная загрузка
        this.updateChar();
    }

    updateChar = () => { // Обновляет персонажа в RandomChar
        this.setState({loading: true, error: false})
        const min = 1011136;
        const max = 1011334;
        const id = Math.floor(Math.random() * (max - min + 1)) + min;
        this.marvelService
        .getCharacter(id) // Является промисом поэтому можем использовать цепочку then
        .then(this.onCharLoaded) // Загружает данные в обьект char
        .catch(this.onError)
    };

    handleButtonClick = (e) => {
        this.updateChar(); // Вызов метода
        e.preventDefault();
    };
    
    render() {
        const {char, loading, error} = this.state;
        console.log(char)

        const errorMessage = error ? <ErrorMessage></ErrorMessage> : null;
        const spinner = loading ? <Spinner></Spinner> : null;
        const content = !(loading || error) ? <RenderRandomChar char={char}/> : null;

        return (
                <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!
                        <br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">Or choose another one</p>
                    <button onClick={e => {this.handleButtonClick(e)}} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img
                        src={mjolnir}
                        alt="mjolnir"
                        className="randomchar__decoration"
                    />
                </div>
            </div>
        )
    }
}

// Функция
const RenderRandomChar = ({char}) => {

    const style = {
        objectFit: 'fill'
    }

    const {name, thumbnail, homepage, wiki, description} = char;

    return (
        <div className="randomchar__block">
                    <img style={style}
                        src={thumbnail}
                        alt="Random character"
                        className="randomchar__img"
                    />
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">{description}</p>
                        <div className="randomchar__btns">
                            <a
                            href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;